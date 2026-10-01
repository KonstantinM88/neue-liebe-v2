import { NextRequest, NextResponse } from 'next/server'
import type { Prisma } from '@/generated/prisma/client'
import { Occasion, ReservationStatus } from '@/generated/prisma/enums'
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { confirmReservation } from '@/lib/reservation-confirm-action'
import { notifyReservationCancellation } from '@/lib/reservation-cancellation-notify'
import { isFutureReservation, isWithinOpeningHours } from '@/lib/reservation-datetime'
import { sendReservationUpdateEmail } from '@/lib/reservation-email'

export const runtime = 'nodejs'

function json(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
}

function authorized(request: NextRequest) {
  return verifyAdminSessionToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value)
}

function dateValue(value: unknown): Date | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value ? date : null
}

function stringValue(value: unknown, max: number): string | null {
  return typeof value === 'string' && value.trim().length <= max ? value.trim() : null
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) return json({ error: 'Unauthorized' }, 401)

  const params = request.nextUrl.searchParams
  const status = params.get('status')
  const query = params.get('query')?.trim().slice(0, 80) ?? ''
  const from = params.get('from')
  const to = params.get('to')
  if (status && status !== 'ALL' && !Object.values(ReservationStatus).includes(status as ReservationStatus)) {
    return json({ error: 'Invalid status' }, 400)
  }
  if ((from && !dateValue(from)) || (to && !dateValue(to))) return json({ error: 'Invalid date filter' }, 400)
  const fromDate = from ? dateValue(from) : null
  const toDate = to ? dateValue(to) : null

  const where: Prisma.ReservationWhereInput = {
    ...(status && status !== 'ALL' ? { status: status as ReservationStatus } : {}),
    ...(fromDate || toDate ? { date: { ...(fromDate ? { gte: fromDate } : {}), ...(toDate ? { lte: toDate } : {}) } } : {}),
    ...(query ? { OR: [
      { id: { contains: query, mode: 'insensitive' } },
      { firstName: { contains: query, mode: 'insensitive' } },
      { lastName: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
      { phone: { contains: query, mode: 'insensitive' } },
    ] } : {}),
  }

  try {
    const [items, total] = await Promise.all([
      prisma.reservation.findMany({ where, orderBy: [{ createdAt: 'desc' }], take: 100 }),
      prisma.reservation.count({ where }),
    ])
    return json({ items, total })
  } catch (error) {
    console.error('[GET /api/admin/reservations]', error)
    return json({ error: 'Failed to load reservations' }, 500)
  }
}

export async function PATCH(request: NextRequest) {
  if (!authorized(request)) return json({ error: 'Unauthorized' }, 401)
  if (Number(request.headers.get('content-length') ?? 0) > 8192) return json({ error: 'Request too large' }, 413)

  let body: Record<string, unknown>
  try {
    const raw = await request.text()
    if (raw.length > 8192) return json({ error: 'Request too large' }, 413)
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return json({ error: 'Invalid body' }, 400)
    body = parsed as Record<string, unknown>
  } catch {
    return json({ error: 'Invalid body' }, 400)
  }

  const id = body.id
  const action = body.action
  if (typeof id !== 'string' || !/^[a-z0-9]{20,40}$/.test(id)) return json({ error: 'Invalid reservation' }, 400)
  if (!['save', 'confirm', 'cancel', 'no_show', 'notify_update'].includes(String(action))) return json({ error: 'Invalid action' }, 400)

  try {
    if (action === 'confirm') {
      const status = await confirmReservation(id, request.nextUrl.origin)
      return json({ status }, ['not_available', 'past_reservation', 'outside_opening_hours'].includes(status) ? 409 : 200)
    }

    const current = await prisma.reservation.findUnique({ where: { id } })
    if (!current) return json({ error: 'Reservation not found' }, 404)

    if (action === 'notify_update') {
      if (current.status !== ReservationStatus.PENDING && current.status !== ReservationStatus.CONFIRMED) {
        return json({ status: 'not_available' }, 409)
      }
      const notification = await sendReservationUpdateEmail(current, request.nextUrl.origin)
      return json({ status: notification === 'sent' ? 'notified' : 'email_failed' })
    }

    if (action === 'cancel') {
      const reason = body.reason === undefined || body.reason === null ? '' : stringValue(body.reason, 1000)
      if (reason === null) return json({ error: 'Invalid cancellation reason' }, 400)
      if (current.status === ReservationStatus.NO_SHOW) return json({ status: 'not_available' }, 409)
      if (current.status !== ReservationStatus.CANCELLED) {
        const changed = await prisma.reservation.updateMany({
          where: { id, status: current.status },
          data: { status: ReservationStatus.CANCELLED, cancellationReason: reason || null, cancelledAt: new Date() },
        })
        if (changed.count === 0) return json({ status: 'conflict' }, 409)
      }
      const notification = await notifyReservationCancellation(id)
      return json({ status: notification === 'sent' ? 'cancelled' : notification === 'processing' ? 'processing' : 'notification_failed' })
    }

    if (action === 'no_show') {
      if (current.status !== ReservationStatus.CONFIRMED) return json({ status: 'not_available' }, 409)
      if (isFutureReservation(current.date.toISOString().slice(0, 10), current.time)) return json({ status: 'too_early' }, 409)
      const changed = await prisma.reservation.updateMany({
        where: { id, status: ReservationStatus.CONFIRMED },
        data: { status: ReservationStatus.NO_SHOW },
      })
      return json({ status: changed.count === 1 ? 'no_show' : 'conflict' }, changed.count === 1 ? 200 : 409)
    }

    const input = body.reservation
    if (!input || typeof input !== 'object' || Array.isArray(input)) return json({ error: 'Invalid reservation details' }, 400)
    const fields = input as Record<string, unknown>
    const firstName = stringValue(fields.firstName, 100)
    const lastName = stringValue(fields.lastName, 100)
    const email = stringValue(fields.email, 254)?.toLowerCase()
    const phone = stringValue(fields.phone, 50)
    const date = dateValue(fields.date)
    const time = stringValue(fields.time, 5)
    const guests = fields.guests
    const occasion = fields.occasion
    const specialRequest = stringValue(fields.specialRequest, 2000)
    const lang = fields.lang
    if (!firstName || !lastName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || phone === null || !date || !time || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
      || !Number.isInteger(guests) || (guests as number) < 1 || (guests as number) > 100
      || !Object.values(Occasion).includes(occasion as Occasion)
      || specialRequest === null || !['de', 'en'].includes(String(lang))) {
      return json({ error: 'Invalid reservation details' }, 400)
    }

    const dateString = date.toISOString().slice(0, 10)
    const slotChanged = dateString !== current.date.toISOString().slice(0, 10) || time !== current.time
    if (slotChanged && (current.status === ReservationStatus.PENDING || current.status === ReservationStatus.CONFIRMED)) {
      if (!isFutureReservation(dateString, time)) return json({ error: 'past_reservation' }, 400)
      if (!isWithinOpeningHours(dateString, time)) return json({ error: 'outside_opening_hours' }, 400)
    }

    const expectedUpdatedAt = body.updatedAt
    if (typeof expectedUpdatedAt !== 'string' || Number.isNaN(new Date(expectedUpdatedAt).getTime())) {
      return json({ error: 'Invalid version' }, 400)
    }
    const detailsChanged = slotChanged || firstName !== current.firstName || lastName !== current.lastName
      || email !== current.email || phone !== current.phone || guests !== current.guests
      || occasion !== current.occasion || (specialRequest || null) !== current.specialRequest || lang !== current.lang
    if (!detailsChanged) return json({ status: 'unchanged' })
    const changed = await prisma.reservation.updateMany({
      where: { id, updatedAt: new Date(expectedUpdatedAt), status: current.status },
      data: {
        firstName, lastName, email, phone, date, time, guests: guests as number,
        occasion: occasion as Occasion, specialRequest: specialRequest || null, lang: lang as string,
        ...(email !== current.email && current.status === ReservationStatus.CONFIRMED
          ? { cancellationTokenVersion: { increment: 1 } }
          : {}),
      },
    })
    if (changed.count === 0) return json({ status: 'conflict' }, 409)

    const updated = await prisma.reservation.findUniqueOrThrow({ where: { id } })
    const notification = updated.status === ReservationStatus.PENDING || updated.status === ReservationStatus.CONFIRMED
      ? await sendReservationUpdateEmail(updated, request.nextUrl.origin)
      : 'not_sent'
    return json({ status: 'updated', notification })
  } catch (error) {
    console.error('[PATCH /api/admin/reservations]', error)
    return json({ error: 'Failed to update reservation' }, 500)
  }
}
