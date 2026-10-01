import 'server-only'

import { ReservationStatus } from '@/generated/prisma/enums'
import { prisma } from '@/lib/prisma'
import { sendReservationCancellationGuestEmail, sendReservationCancellationManagerEmail } from '@/lib/reservation-email'

export async function notifyReservationCancellation(id: string): Promise<'sent' | 'processing' | 'failed'> {
  const now = new Date()
  const staleClaim = new Date(now.getTime() - 5 * 60 * 1000)
  const claim = await prisma.reservation.updateMany({
    where: {
      id,
      status: ReservationStatus.CANCELLED,
      OR: [
        { cancellationNotificationClaimedAt: null },
        { cancellationNotificationClaimedAt: { lt: staleClaim } },
      ],
      NOT: {
        cancellationManagerEmailSentAt: { not: null },
        cancellationGuestEmailSentAt: { not: null },
      },
    },
    data: { cancellationNotificationClaimedAt: now },
  })

  if (claim.count === 0) {
    const current = await prisma.reservation.findUnique({
      where: { id },
      select: { cancellationManagerEmailSentAt: true, cancellationGuestEmailSentAt: true },
    })
    return current?.cancellationManagerEmailSentAt && current.cancellationGuestEmailSentAt ? 'sent' : 'processing'
  }

  try {
    const current = await prisma.reservation.findUniqueOrThrow({ where: { id } })
    if (!current.cancellationManagerEmailSentAt) {
      const sent = await sendReservationCancellationManagerEmail(current)
      if (sent === 'sent') {
        await prisma.reservation.updateMany({
          where: { id, cancellationNotificationClaimedAt: now, cancellationManagerEmailSentAt: null },
          data: { cancellationManagerEmailSentAt: new Date() },
        })
      }
    }
    if (!current.cancellationGuestEmailSentAt) {
      const sent = await sendReservationCancellationGuestEmail(current)
      if (sent === 'sent') {
        await prisma.reservation.updateMany({
          where: { id, cancellationNotificationClaimedAt: now, cancellationGuestEmailSentAt: null },
          data: { cancellationGuestEmailSentAt: new Date() },
        })
      }
    }
  } finally {
    await prisma.reservation.updateMany({
      where: { id, cancellationNotificationClaimedAt: now },
      data: { cancellationNotificationClaimedAt: null },
    })
  }

  const current = await prisma.reservation.findUnique({
    where: { id },
    select: { cancellationManagerEmailSentAt: true, cancellationGuestEmailSentAt: true },
  })
  return current?.cancellationManagerEmailSentAt && current.cancellationGuestEmailSentAt ? 'sent' : 'failed'
}
