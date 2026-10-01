import 'server-only'

import { ReservationStatus } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import { sendReservationConfirmationEmail } from '@/lib/reservation-email'
import { isFutureReservation, isWithinOpeningHours } from '@/lib/reservation-datetime'

export type ConfirmReservationResult = 'confirmed' | 'already_confirmed' | 'processing' | 'email_failed' | 'not_available' | 'past_reservation' | 'outside_opening_hours'

export async function confirmReservation(id: string, origin: string): Promise<ConfirmReservationResult> {
  const reservation = await prisma.reservation.findUnique({ where: { id } })
  if (!reservation || reservation.status === ReservationStatus.CANCELLED || reservation.status === ReservationStatus.NO_SHOW) {
    return 'not_available'
  }

  if (reservation.status === ReservationStatus.PENDING) {
    const date = reservation.date.toISOString().slice(0, 10)
    if (!isFutureReservation(date, reservation.time)) return 'past_reservation'
    if (!isWithinOpeningHours(date, reservation.time)) return 'outside_opening_hours'
    await prisma.reservation.updateMany({
      where: { id, status: ReservationStatus.PENDING },
      data: { status: ReservationStatus.CONFIRMED },
    })
  }

  const now = new Date()
  const staleClaim = new Date(now.getTime() - 5 * 60 * 1000)
  const claim = await prisma.reservation.updateMany({
    where: {
      id,
      status: ReservationStatus.CONFIRMED,
      confirmationEmailSentAt: null,
      OR: [
        { confirmationEmailClaimedAt: null },
        { confirmationEmailClaimedAt: { lt: staleClaim } },
      ],
    },
    data: { confirmationEmailClaimedAt: now },
  })

  if (claim.count === 0) {
    const current = await prisma.reservation.findUnique({
      where: { id },
      select: { status: true, confirmationEmailSentAt: true },
    })
    if (current?.status !== ReservationStatus.CONFIRMED) return 'not_available'
    return current.confirmationEmailSentAt ? 'already_confirmed' : 'processing'
  }

  try {
    const current = await prisma.reservation.findUniqueOrThrow({ where: { id } })
    const notification = await sendReservationConfirmationEmail(current, origin)
    if (notification === 'sent') {
      const marked = await prisma.reservation.updateMany({
        where: { id, status: ReservationStatus.CONFIRMED, confirmationEmailClaimedAt: now, confirmationEmailSentAt: null },
        data: { confirmationEmailSentAt: new Date(), confirmationEmailClaimedAt: null },
      })
      return marked.count === 1 ? 'confirmed' : 'processing'
    }
    return 'email_failed'
  } finally {
    await prisma.reservation.updateMany({
      where: { id, confirmationEmailClaimedAt: now },
      data: { confirmationEmailClaimedAt: null },
    })
  }
}
