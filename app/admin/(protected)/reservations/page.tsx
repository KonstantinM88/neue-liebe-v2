import type { Metadata } from 'next'
import Cursor from '@/components/Cursor'
import AdminReservationsManager from '@/components/admin/AdminReservationsManager'

export const metadata: Metadata = {
  title: 'Admin | Reservierungen',
  robots: { index: false, follow: false },
}

export default function AdminReservationsPage() {
  return <><Cursor /><AdminReservationsManager /></>
}
