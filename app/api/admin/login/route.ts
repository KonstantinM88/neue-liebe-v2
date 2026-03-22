import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  checkAdminCredentials,
  createAdminSessionToken,
} from '@/lib/admin-auth'

type LoginBody = {
  username?: string
  password?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LoginBody
    const username = String(body?.username ?? '').trim()
    const password = String(body?.password ?? '')

    if (!username || !password) {
      return NextResponse.json({ error: 'Введите логин и пароль.' }, { status: 400 })
    }

    if (!checkAdminCredentials(username, password)) {
      return NextResponse.json({ error: 'Неверный логин или пароль.' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: createAdminSessionToken(username),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_SESSION_TTL_SECONDS,
    })

    return response
  } catch (error) {
    console.error('[POST /api/admin/login]', error)
    return NextResponse.json({ error: 'Ошибка сервера.' }, { status: 500 })
  }
}
