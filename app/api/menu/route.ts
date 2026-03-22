import { NextResponse } from 'next/server'
import { STATIC_MENU_CATEGORIES, STATIC_MENU_DISHES } from '@/lib/menu-static'
import { readManagedMenuData } from '@/lib/menu-store'
import type { MenuCategory, MenuDish } from '@/lib/menu-types'

export const runtime = 'nodejs'

function mergeCategories(staticItems: MenuCategory[], managedItems: MenuCategory[]): MenuCategory[] {
  const map = new Map<string, MenuCategory>()
  staticItems.forEach((item) => map.set(item.key, item))
  managedItems.forEach((item) => map.set(item.key, item))
  return Array.from(map.values())
}

function mergeDishes(staticItems: MenuDish[], managedItems: MenuDish[]): MenuDish[] {
  const map = new Map<string, MenuDish>()
  staticItems.forEach((item) => map.set(item.id, item))
  managedItems.forEach((item) => map.set(item.id, item))
  return Array.from(map.values())
}

export async function GET() {
  try {
    const managed = await readManagedMenuData()
    const categories = mergeCategories(STATIC_MENU_CATEGORIES, managed.categories)
    const dishes = mergeDishes(STATIC_MENU_DISHES, managed.dishes)

    return NextResponse.json({ categories, dishes })
  } catch (error) {
    console.error('[GET /api/menu]', error)
    return NextResponse.json({ error: 'Ошибка сервера.' }, { status: 500 })
  }
}
