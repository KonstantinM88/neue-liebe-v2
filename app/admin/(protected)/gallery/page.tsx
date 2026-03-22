import type { Metadata } from 'next'
import Cursor from '@/components/Cursor'
import AdminGalleryManager from '@/components/admin/AdminGalleryManager'

export const metadata: Metadata = {
  title: 'Admin | Galerie',
  description: 'Admin-Bereich zur Verwaltung der Neue-Liebe-Galerie',
}

export default function AdminGalleryPage() {
  return (
    <>
      <Cursor />
      <AdminGalleryManager />
    </>
  )
}
