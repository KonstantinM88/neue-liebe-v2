import type { Reservation } from '@/generated/prisma/client'
import { reservationStart } from '@/lib/reservation-datetime'

const cancellationWindowMs = 24 * 60 * 60 * 1000

export function cancellationDeadline(reservation: Pick<Reservation, 'date' | 'time'>): Date {
  const date = reservation.date.toISOString().slice(0, 10)
  return new Date(reservationStart(date, reservation.time).getTime() - cancellationWindowMs)
}

export function canCancelReservation(reservation: Pick<Reservation, 'date' | 'time'>, now = new Date()): boolean {
  return now.getTime() <= cancellationDeadline(reservation).getTime()
}
