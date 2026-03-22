import type { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/admin-auth'

type ProtectedLayoutProps = {
  children: ReactNode
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value

  if (!verifyAdminSessionToken(token)) {
    redirect('/admin/login')
  }

  return children
}
