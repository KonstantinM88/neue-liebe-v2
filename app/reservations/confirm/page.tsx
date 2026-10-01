import type { Metadata } from 'next'
import ConfirmReservationClient from './ConfirmReservationClient'

export const metadata: Metadata = {
  title: 'Reservierungsanfrage bestätigen | Neue Liebe',
  robots: { index: false, follow: false },
}

export default function ConfirmReservationPage() {
  return <ConfirmReservationClient />
}
