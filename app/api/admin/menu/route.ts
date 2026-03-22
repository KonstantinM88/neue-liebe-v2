import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/admin-auth'
import { STATIC_MENU_CATEGORIES, STATIC_MENU_DISHES } from '@/lib/menu-static'
import {
  addManagedMenuCategory,
  addManagedMenuDish,
  ensureMenuStorage,
  MENU_UPLOAD_DIR,
  normalizeMenuPrice,
  normalizeMenuText,
  readManagedMenuData,
  slugifyMenuDishId,
  slugifyMenuKey,
  slugifyMenuValue,
} from '@/lib/menu-store'
import type {
  AdminMenuCategory,
  AdminMenuDish,
  ManagedMenuCategory,
  ManagedMenuDish,
  MenuCategory,
  MenuDish,
} from '@/lib/menu-types'

export const runtime = 'nodejs'

const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024

function isAdminAuthorized(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value
  return verifyAdminSessionToken(token)
}

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

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const managed = await readManagedMenuData()

    const categoriesMap = new Map<string, AdminMenuCategory>()
    STATIC_MENU_CATEGORIES.forEach((item) => {
      categoriesMap.set(item.key, { ...item, source: 'static' })
    })
    managed.categories.forEach((item) => {
      categoriesMap.set(item.key, { ...item, source: 'upload' })
    })

    const dishesMap = new Map<string, AdminMenuDish>()
    STATIC_MENU_DISHES.forEach((item) => {
      dishesMap.set(item.id, { ...item, source: 'static' })
    })
    managed.dishes.forEach((item) => {
      dishesMap.set(item.id, { ...item, source: 'upload' })
    })

    return NextResponse.json({
      categories: Array.from(categoriesMap.values()),
      dishes: Array.from(dishesMap.values()),
    })
  } catch (error) {
    console.error('[GET /api/admin/menu]', error)
    return NextResponse.json({ error: 'Ошибка сервера.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const action = String(formData.get('action') ?? '')

    if (action === 'create-category') {
      const de = normalizeMenuText(String(formData.get('de') ?? ''), 48)
      const enRaw = normalizeMenuText(String(formData.get('en') ?? ''), 48)
      const keyRaw = normalizeMenuText(String(formData.get('key') ?? ''), 48)
      const en = enRaw || de
      let key = slugifyMenuKey(keyRaw || de || en)

      if (!de) {
        return NextResponse.json({ error: 'Заполните название категории.' }, { status: 400 })
      }
      if (!key) {
        key = `category-${Date.now()}`
      }

      const managed = await readManagedMenuData()
      const allCategories = mergeCategories(STATIC_MENU_CATEGORIES, managed.categories)
      const exists = allCategories.some((item) => item.key === key)
      if (exists) {
        return NextResponse.json({ error: 'Категория с таким ключом уже существует.' }, { status: 409 })
      }

      const category: ManagedMenuCategory = {
        key,
        de,
        en,
        createdAt: new Date().toISOString(),
      }

      const next = await addManagedMenuCategory(category)
      return NextResponse.json({
        success: true,
        category,
        totals: {
          categories: next.categories.length + STATIC_MENU_CATEGORIES.length,
        },
      })
    }

    if (action === 'update-category') {
      const originalKey = slugifyMenuKey(String(formData.get('originalKey') ?? ''))
      const de = normalizeMenuText(String(formData.get('de') ?? ''), 48)
      const enRaw = normalizeMenuText(String(formData.get('en') ?? ''), 48)
      const en = enRaw || de

      if (!originalKey || !de) {
        return NextResponse.json({ error: 'Заполните название категории.' }, { status: 400 })
      }

      const managed = await readManagedMenuData()
      const allCategories = mergeCategories(STATIC_MENU_CATEGORIES, managed.categories)
      const exists = allCategories.some((item) => item.key === originalKey)
      if (!exists) {
        return NextResponse.json({ error: 'Категория не найдена.' }, { status: 404 })
      }

      const existingManaged = managed.categories.find((item) => item.key === originalKey)
      const category: ManagedMenuCategory = {
        key: originalKey,
        de,
        en,
        createdAt: existingManaged?.createdAt ?? new Date().toISOString(),
      }

      const next = await addManagedMenuCategory(category)
      return NextResponse.json({
        success: true,
        category,
        totals: {
          categories: next.categories.length + STATIC_MENU_CATEGORIES.length,
        },
      })
    }

    if (action === 'create-dish' || action === 'update-dish') {
      const photoEntry = formData.get('photo')
      const hasNewPhoto = photoEntry instanceof File && photoEntry.size > 0

      if (hasNewPhoto && !photoEntry.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Фото должно быть изображением.' }, { status: 400 })
      }
      if (action === 'create-dish' && !hasNewPhoto) {
        return NextResponse.json({ error: 'Выберите фото блюда (jpg/png/webp/avif и т.д.).' }, { status: 400 })
      }

      const category = slugifyMenuKey(String(formData.get('category') ?? ''))
      const originalId = slugifyMenuDishId(String(formData.get('originalId') ?? ''))
      const managed = await readManagedMenuData()
      const allCategories = mergeCategories(STATIC_MENU_CATEGORIES, managed.categories)
      const allDishes = mergeDishes(STATIC_MENU_DISHES, managed.dishes)
      const categoryMeta = allCategories.find((item) => item.key === category)
      if (!categoryMeta) {
        return NextResponse.json({ error: 'Выберите категорию для блюда.' }, { status: 400 })
      }

      const existingDish = action === 'update-dish'
        ? allDishes.find((item) => item.id === originalId)
        : undefined
      if (action === 'update-dish' && !existingDish) {
        return NextResponse.json({ error: 'Блюдо не найдено.' }, { status: 404 })
      }

      const nameDe = normalizeMenuText(String(formData.get('nameDe') ?? ''), 96)
      const nameEnRaw = normalizeMenuText(String(formData.get('nameEn') ?? ''), 96)
      const descDe = normalizeMenuText(String(formData.get('descDe') ?? ''), 260)
      const descEnRaw = normalizeMenuText(String(formData.get('descEn') ?? ''), 260)
      const tagDeRaw = normalizeMenuText(String(formData.get('tagDe') ?? ''), 36)
      const tagEnRaw = normalizeMenuText(String(formData.get('tagEn') ?? ''), 36)
      const price = normalizeMenuPrice(String(formData.get('price') ?? ''))
      const idRaw = normalizeMenuText(String(formData.get('id') ?? ''), 64)

      if (!nameDe || !descDe || !price) {
        return NextResponse.json(
          { error: 'Заполните обязательные поля блюда: название, описание и цену.' },
          { status: 400 }
        )
      }

      const nameEn = nameEnRaw || nameDe
      const descEn = descEnRaw || descDe
      const tagDe = tagDeRaw || categoryMeta.de
      const tagEn = tagEnRaw || categoryMeta.en

      let dishId = action === 'update-dish'
        ? originalId
        : slugifyMenuDishId(idRaw || nameDe)
      if (!dishId) {
        dishId = `dish-${Date.now()}`
      }

      if (action === 'create-dish') {
        const existingIds = new Set(allDishes.map((item) => item.id))
        if (existingIds.has(dishId)) {
          dishId = `${dishId}-${Date.now()}`
        }
      }

      await ensureMenuStorage()

      let imgDesktop = existingDish?.imgDesktop ?? ''
      let imgMobile = existingDish?.imgMobile ?? ''

      if (hasNewPhoto && photoEntry instanceof File) {
        const sourceBuffer = Buffer.from(await photoEntry.arrayBuffer())
        if (sourceBuffer.length === 0) {
          return NextResponse.json({ error: 'Файл фото пустой.' }, { status: 400 })
        }
        if (sourceBuffer.length > MAX_IMAGE_SIZE_BYTES) {
          return NextResponse.json({ error: 'Фото слишком большое. Максимум 25 MB.' }, { status: 400 })
        }

        const fileNameBase = slugifyMenuValue(photoEntry.name.replace(/\.[^.]+$/, ''), 32) || 'menu-dish'
        const unique = `${Date.now()}-${randomUUID().slice(0, 8)}`
        const desktopName = `${fileNameBase}-${unique}_1600.webp`
        const mobileName = `${fileNameBase}-${unique}_900.webp`
        const desktopPath = path.join(MENU_UPLOAD_DIR, desktopName)
        const mobilePath = path.join(MENU_UPLOAD_DIR, mobileName)

        const image = sharp(sourceBuffer).rotate()
        const desktopWebp = await image
          .clone()
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 84 })
          .toBuffer()
        const mobileWebp = await image
          .clone()
          .resize({ width: 900, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer()

        await writeFile(desktopPath, desktopWebp)
        await writeFile(mobilePath, mobileWebp)

        imgDesktop = `/uploads/menu/${desktopName}`
        imgMobile = `/uploads/menu/${mobileName}`
      }

      if (!imgDesktop || !imgMobile) {
        return NextResponse.json({ error: 'Не удалось подготовить фото блюда.' }, { status: 400 })
      }

      const dish: ManagedMenuDish = {
        id: dishId,
        imgDesktop,
        imgMobile,
        tagDe,
        tagEn,
        nameDe,
        nameEn,
        descDe,
        descEn,
        price,
        category,
        createdAt: managed.dishes.find((item) => item.id === dishId)?.createdAt ?? new Date().toISOString(),
      }

      const next = await addManagedMenuDish(dish)
      return NextResponse.json({
        success: true,
        dish,
        totals: {
          dishes: next.dishes.length + STATIC_MENU_DISHES.length,
        },
      })
    }

    return NextResponse.json({ error: 'Неизвестное действие.' }, { status: 400 })
  } catch (error) {
    console.error('[POST /api/admin/menu]', error)
    return NextResponse.json({ error: 'Ошибка сервера.' }, { status: 500 })
  }
}
