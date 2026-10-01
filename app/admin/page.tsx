import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/admin-auth'

export default async function AdminEntryPage() {
  const cookieStore = await cookies()
  redirect(verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
    ? '/admin/reservations'
    : '/admin/login')
}
