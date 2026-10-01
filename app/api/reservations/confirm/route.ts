import { NextRequest, NextResponse } from 'next/server'
import { verifyReservationConfirmationToken } from '@/lib/reservation-confirmation-token'
import { confirmReservation } from '@/lib/reservation-confirm-action'

export const runtime = 'nodejs'

function result(status: string, httpStatus = 200) {
  return NextResponse.json({ status }, {
    status: httpStatus,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(request: NextRequest) {
  if (Number(request.headers.get('content-length') ?? 0) > 1024) return result('invalid_link', 413)

  let token: unknown
  try {
    const body: unknown = await request.json()
    token = body && typeof body === 'object' && !Array.isArray(body)
      ? (body as Record<string, unknown>).token
      : null
  } catch {
    return result('invalid_link', 400)
  }

  if (typeof token !== 'string') return result('invalid_link', 400)
  const id = verifyReservationConfirmationToken(token)
  if (!id) return result('invalid_link', 400)

  try {
    const status = await confirmReservation(id, request.nextUrl.origin)
    return result(status, status === 'not_available' || status === 'past_reservation' || status === 'outside_opening_hours' ? 409 : 200)
  } catch (error) {
    console.error('[POST /api/reservations/confirm]', error)
    return result('server_error', 500)
  }
}
