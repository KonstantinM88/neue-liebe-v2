ALTER TABLE "reservations"
ADD COLUMN "confirmationEmailSentAt" TIMESTAMP(3),
ADD COLUMN "confirmationEmailClaimedAt" TIMESTAMP(3);
