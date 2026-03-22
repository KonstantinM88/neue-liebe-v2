import 'server-only'

import path from 'node:path'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import type { ManagedMenuCategory, ManagedMenuData, ManagedMenuDish } from '@/lib/menu-types'

const DATA_DIR = path.join(process.cwd(), 'data')
const MENU_FILE_PATH = path.join(DATA_DIR, 'menu.json')
export const MENU_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'menu')

function emptyManagedMenuData(): ManagedMenuData {
  return { categories: [], dishes: [] }
}

function isManagedMenuCategory(entry: unknown): entry is ManagedMenuCategory {
  if (!entry || typeof entry !== 'object') return false
  const value = entry as Record<string, unknown>
  return (
    typeof value.key === 'string'
    && typeof value.de === 'string'
    && typeof value.en === 'string'
    && typeof value.createdAt === 'string'
  )
}

function isManagedMenuDish(entry: unknown): entry is ManagedMenuDish {
  if (!entry || typeof entry !== 'object') return false
  const value = entry as Record<string, unknown>
  return (
    typeof value.id === 'string'
    && typeof value.imgDesktop === 'string'
    && typeof value.imgMobile === 'string'
    && typeof value.tagDe === 'string'
    && typeof value.tagEn === 'string'
    && typeof value.nameDe === 'string'
    && typeof value.nameEn === 'string'
    && typeof value.descDe === 'string'
    && typeof value.descEn === 'string'
    && typeof value.price === 'string'
    && typeof value.category === 'string'
    && typeof value.createdAt === 'string'
  )
}

export function slugifyMenuValue(value: string, maxLength = 42): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
}

export function slugifyMenuKey(value: string): string {
  return slugifyMenuValue(value, 36)
}

export function slugifyMenuDishId(value: string): string {
  return slugifyMenuValue(value, 56)
}

export function normalizeMenuText(value: string, maxLength: number): string {
  return String(value).trim().replace(/\s+/g, ' ').slice(0, maxLength)
}

export function normalizeMenuPrice(value: string): string {
  return normalizeMenuText(value, 18)
}

export async function ensureMenuStorage(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  await mkdir(MENU_UPLOAD_DIR, { recursive: true })
}

export async function readManagedMenuData(): Promise<ManagedMenuData> {
  await ensureMenuStorage()

  try {
    const raw = await readFile(MENU_FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return emptyManagedMenuData()
    }

    const parsedRecord = parsed as Record<string, unknown>
    const categoriesValue = parsedRecord.categories
    const dishesValue = parsedRecord.dishes

    const categoriesRaw: unknown[] = Array.isArray(categoriesValue) ? categoriesValue : []
    const dishesRaw: unknown[] = Array.isArray(dishesValue) ? dishesValue : []

    return {
      categories: categoriesRaw.filter(isManagedMenuCategory),
      dishes: dishesRaw.filter(isManagedMenuDish),
    }
  } catch {
    return emptyManagedMenuData()
  }
}

async function writeManagedMenuData(data: ManagedMenuData): Promise<void> {
  await ensureMenuStorage()
  await writeFile(MENU_FILE_PATH, JSON.stringify(data, null, 2), 'utf8')
}

export async function addManagedMenuCategory(item: ManagedMenuCategory): Promise<ManagedMenuData> {
  const current = await readManagedMenuData()
  const next: ManagedMenuData = {
    categories: [item, ...current.categories.filter((entry) => entry.key !== item.key)],
    dishes: current.dishes,
  }
  await writeManagedMenuData(next)
  return next
}

export async function addManagedMenuDish(item: ManagedMenuDish): Promise<ManagedMenuData> {
  const current = await readManagedMenuData()
  const next: ManagedMenuData = {
    categories: current.categories,
    dishes: [item, ...current.dishes.filter((entry) => entry.id !== item.id)],
  }
  await writeManagedMenuData(next)
  return next
}
