import { NextResponse } from 'next/server'
import { getPublicMenuData } from '@/lib/menu-public'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const { categories, dishes } = await getPublicMenuData()

    return NextResponse.json(
      { categories, dishes },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=900, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    console.error('[GET /api/menu]', error)
    return NextResponse.json({ error: 'Ошибка сервера.' }, { status: 500 })
  }
}
