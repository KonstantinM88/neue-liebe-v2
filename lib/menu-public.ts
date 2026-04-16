import 'server-only'

import { STATIC_MENU_CATEGORIES, STATIC_MENU_DISHES } from '@/lib/menu-static'
import { readManagedMenuData } from '@/lib/menu-store'
import type { MenuCategory, MenuDish } from '@/lib/menu-types'

export type PublicMenuData = {
  categories: MenuCategory[]
  dishes: MenuDish[]
}

export function mergePublicMenuCategories(
  staticItems: MenuCategory[],
  managedItems: MenuCategory[]
): MenuCategory[] {
  const map = new Map<string, MenuCategory>()
  staticItems.forEach((item) => map.set(item.key, item))
  managedItems.forEach((item) => map.set(item.key, item))
  return Array.from(map.values())
}

export function mergePublicMenuDishes(
  staticItems: MenuDish[],
  managedItems: MenuDish[]
): MenuDish[] {
  const map = new Map<string, MenuDish>()
  staticItems.forEach((item) => map.set(item.id, item))
  managedItems.forEach((item) => map.set(item.id, item))
  return Array.from(map.values())
}

export async function getPublicMenuData(): Promise<PublicMenuData> {
  const managed = await readManagedMenuData()

  return {
    categories: mergePublicMenuCategories(STATIC_MENU_CATEGORIES, managed.categories),
    dishes: mergePublicMenuDishes(STATIC_MENU_DISHES, managed.dishes),
  }
}
