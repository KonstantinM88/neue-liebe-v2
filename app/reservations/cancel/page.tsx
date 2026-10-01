import type { Metadata } from 'next'
import CancelReservationClient from './CancelReservationClient'

export const metadata: Metadata = {
  title: 'Reservierung stornieren | Neue Liebe',
  robots: { index: false, follow: false },
}

export default function CancelReservationPage() {
  return <CancelReservationClient />
}
