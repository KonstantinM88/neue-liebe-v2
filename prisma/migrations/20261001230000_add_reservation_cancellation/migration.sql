ALTER TABLE "reservations"
ADD COLUMN "cancellationReason" TEXT,
ADD COLUMN "cancelledAt" TIMESTAMP(3),
ADD COLUMN "cancellationNotificationClaimedAt" TIMESTAMP(3),
ADD COLUMN "cancellationManagerEmailSentAt" TIMESTAMP(3),
ADD COLUMN "cancellationGuestEmailSentAt" TIMESTAMP(3);
