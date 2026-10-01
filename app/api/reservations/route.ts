import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Occasion, ReservationStatus } from '@/generated/prisma/enums'
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/admin-auth'
import { sendReservationNotification, sendReservationRequestReceivedEmail } from '@/lib/reservation-email'
import { isFutureReservation, isWithinOpeningHours } from '@/lib/reservation-datetime'

export const runtime = 'nodejs'

function normalizedString(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function validDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    ? date
    : null
}

function normalizeReservationStatus(value: string | null): ReservationStatus | undefined {
  if (!value) return undefined

  return Object.values(ReservationStatus).includes(value as ReservationStatus)
    ? (value as ReservationStatus)
    : undefined
}

// ─── POST /api/reservations ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown>
    try {
      const parsed: unknown = await req.json()
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
      }
      body = parsed as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    const firstName = normalizedString(body.firstName, 100)
    const lastName = normalizedString(body.lastName, 100)
    const email = normalizedString(body.email, 254).toLowerCase()
    const phone = normalizedString(body.phone, 50)
    const date = validDate(normalizedString(body.date, 10))
    const time = normalizedString(body.time, 5)
    const guestsLabel = body.guests === '9+' ? '9 oder mehr' : String(body.guests ?? '')
    const guests = body.guests === '9+' ? 9 : Number(body.guests)
    const occasion = body.occasion ?? Occasion.DINNER
    const specialRequest = normalizedString(body.specialRequest, 2000)

    if (
      !firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || !date || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
      || !Number.isInteger(guests) || guests < 1 || guests > 100
      || !Object.values(Occasion).includes(occasion as Occasion)
    ) {
      return NextResponse.json(
        { error: 'Invalid reservation details' },
        { status: 400 }
      )
    }

    if (!isFutureReservation(date.toISOString().slice(0, 10), time)) {
      return NextResponse.json({ error: 'past_reservation' }, { status: 400 })
    }
    if (!isWithinOpeningHours(date.toISOString().slice(0, 10), time)) {
      return NextResponse.json({ error: 'outside_opening_hours' }, { status: 400 })
    }

    const reservation = await prisma.reservation.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        date,
        time,
        guests,
        occasion: occasion as Occasion,
        specialRequest: specialRequest || null,
        lang: body.lang === 'en' ? 'en' : 'de',
      },
    })

    const guestNotification = await sendReservationRequestReceivedEmail(reservation, guestsLabel)
    const notification = await sendReservationNotification(reservation, guestsLabel, req.nextUrl.origin)

    return NextResponse.json(
      { success: true, id: reservation.id, notification, guestNotification },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/reservations]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ─── GET /api/reservations ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!verifyAdminSessionToken(req.cookies.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const status = normalizeReservationStatus(searchParams.get('status'))
    const dateStr = searchParams.get('date')

    const reservations = await prisma.reservation.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(dateStr ? { date: new Date(dateStr) } : {}),
      },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(reservations)
  } catch (err) {
    console.error('[GET /api/reservations]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
