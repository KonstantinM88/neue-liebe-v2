import { NextRequest, NextResponse } from 'next/server'
import { ReservationStatus } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import { canCancelReservation } from '@/lib/reservation-cancellation-policy'
import { reservationCancellationTokenId, verifyReservationCancellationToken } from '@/lib/reservation-cancellation-token'
import { notifyReservationCancellation } from '@/lib/reservation-cancellation-notify'

export const runtime = 'nodejs'

function result(status: string, httpStatus = 200) {
  return NextResponse.json({ status }, {
    status: httpStatus,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(request: NextRequest) {
  if (Number(request.headers.get('content-length') ?? 0) > 4096) return result('invalid_request', 413)

  let token: unknown
  let reason: unknown
  try {
    const raw = await request.text()
    if (raw.length > 4096) return result('invalid_request', 413)
    const body: unknown = JSON.parse(raw)
    if (!body || typeof body !== 'object' || Array.isArray(body)) return result('invalid_request', 400)
    token = (body as Record<string, unknown>).token
    reason = (body as Record<string, unknown>).reason
  } catch {
    return result('invalid_request', 400)
  }

  if (typeof token !== 'string') return result('invalid_link', 400)
  if (reason !== undefined && reason !== null && typeof reason !== 'string') return result('invalid_request', 400)
  const cleanReason = typeof reason === 'string' ? reason.trim() : ''
  if (cleanReason.length > 1000) return result('invalid_request', 400)

  const id = reservationCancellationTokenId(token)
  if (!id) return result('invalid_link', 400)

  try {
    const reservation = await prisma.reservation.findUnique({ where: { id } })
    if (!reservation || !verifyReservationCancellationToken(token, reservation.cancellationTokenVersion)) {
      return result('invalid_link', 400)
    }
    if (reservation.status === ReservationStatus.PENDING) return result('not_confirmed', 409)
    if (reservation.status === ReservationStatus.NO_SHOW) return result('not_available', 409)

    const alreadyCancelled = reservation.status === ReservationStatus.CANCELLED
    if (!alreadyCancelled) {
      if (!canCancelReservation(reservation)) return result('too_late', 409)
      const changed = await prisma.reservation.updateMany({
        where: { id, status: ReservationStatus.CONFIRMED },
        data: {
          status: ReservationStatus.CANCELLED,
          cancellationReason: cleanReason || null,
          cancelledAt: new Date(),
        },
      })
      if (changed.count === 0) {
        const current = await prisma.reservation.findUnique({ where: { id }, select: { status: true } })
        if (current?.status !== ReservationStatus.CANCELLED) return result('not_available', 409)
      }
    }

    const notification = await notifyReservationCancellation(id)
    return result(notification === 'sent'
      ? (alreadyCancelled ? 'already_cancelled' : 'cancelled')
      : notification === 'processing' ? 'processing' : 'notification_failed')
  } catch (error) {
    console.error('[POST /api/reservations/cancel]', error)
    return result('server_error', 500)
  }
}
