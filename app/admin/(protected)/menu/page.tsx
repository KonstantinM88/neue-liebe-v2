import type { Metadata } from 'next'
import Cursor from '@/components/Cursor'
import AdminMenuManager from '@/components/admin/AdminMenuManager'

export const metadata: Metadata = {
  title: 'Admin | Menü',
  description: 'Admin-Bereich zur Verwaltung des Neue-Liebe-Menüs',
}

export default function AdminMenuPage() {
  return (
    <>
      <Cursor />
      <AdminMenuManager />
    </>
  )
}
