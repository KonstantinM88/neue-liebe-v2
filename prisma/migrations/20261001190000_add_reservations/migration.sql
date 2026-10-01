-- CreateEnum
CREATE TYPE "Occasion" AS ENUM ('DINNER', 'BIRTHDAY', 'WEDDING', 'CORPORATE', 'OTHER');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT NOT NULL,
    "guests" INTEGER NOT NULL,
    "occasion" "Occasion" NOT NULL DEFAULT 'DINNER',
    "specialRequest" TEXT,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "lang" TEXT NOT NULL DEFAULT 'de',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reservations_date_idx" ON "reservations"("date");

-- CreateIndex
CREATE INDEX "reservations_email_idx" ON "reservations"("email");

-- CreateIndex
CREATE INDEX "reservations_status_idx" ON "reservations"("status");
