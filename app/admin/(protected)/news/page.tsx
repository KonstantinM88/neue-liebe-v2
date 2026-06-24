import type { Metadata } from 'next'
import Cursor from '@/components/Cursor'
import AdminNewsManager from '@/components/admin/AdminNewsManager'

export const metadata: Metadata = {
  title: 'Admin | Nachrichten',
  description: 'Admin-Bereich zur Verwaltung der Neue-Liebe-Nachrichten',
}

export default function AdminNewsPage() {
  return (
    <>
      <Cursor />
      <AdminNewsManager />
    </>
  )
}
