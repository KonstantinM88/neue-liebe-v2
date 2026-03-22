import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { NextRequest, NextResponse } from 'next/server'
import { STATIC_GALLERY_PHOTOS } from '@/lib/gallery-static'
import {
  addManagedGalleryItems,
  ensureGalleryStorage,
  fileNameToAlt,
  GALLERY_UPLOAD_DIR,
  inferGalleryRatio,
  normalizeGalleryTag,
  readManagedGalleryItems,
  slugifyBaseName,
} from '@/lib/gallery-store'
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/admin-auth'
import type { AdminGalleryItem, ManagedGalleryItem } from '@/lib/gallery-types'

export const runtime = 'nodejs'

const MAX_FILES_PER_REQUEST = 20

function isAdminAuthorized(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value
  return verifyAdminSessionToken(token)
}

function asImageFiles(values: FormDataEntryValue[]): File[] {
  return values.filter((value): value is File => value instanceof File && value.type.startsWith('image/'))
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const managedItems = await readManagedGalleryItems()
    const uploadItems: AdminGalleryItem[] = managedItems.map((item) => ({
      ...item,
      source: 'upload',
    }))
    const staticItems: AdminGalleryItem[] = STATIC_GALLERY_PHOTOS.map((photo, index) => ({
      id: `static-${index + 1}`,
      desktop: photo.desktop,
      mobile: photo.mobile,
      alt: photo.alt,
      tag: photo.tag,
      ratio: photo.ratio,
      createdAt: '',
      source: 'static',
    }))
    const items: AdminGalleryItem[] = [...uploadItems, ...staticItems]
    return NextResponse.json({ items })
  } catch (error) {
    console.error('[GET /api/admin/gallery]', error)
    return NextResponse.json({ error: 'Ошибка сервера.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const files = asImageFiles(formData.getAll('files'))
    const tag = normalizeGalleryTag(String(formData.get('tag') ?? ''))
    const altPrefix = String(formData.get('alt') ?? '').trim().slice(0, 80)

    if (files.length === 0) {
      return NextResponse.json({ error: 'Выберите хотя бы один файл изображения.' }, { status: 400 })
    }

    if (files.length > MAX_FILES_PER_REQUEST) {
      return NextResponse.json(
        { error: `Можно загрузить не более ${MAX_FILES_PER_REQUEST} файлов за раз.` },
        { status: 400 }
      )
    }

    await ensureGalleryStorage()

    const createdItems: ManagedGalleryItem[] = []
    const skipped: { file: string; reason: string }[] = []

    for (const [index, file] of files.entries()) {
      try {
        const sourceBuffer = Buffer.from(await file.arrayBuffer())
        if (sourceBuffer.length === 0) {
          skipped.push({ file: file.name, reason: 'Пустой файл' })
          continue
        }

        const image = sharp(sourceBuffer).rotate()
        const metadata = await image.metadata()
        const ratio = inferGalleryRatio(metadata.width, metadata.height)

        const baseName = slugifyBaseName(file.name) || 'gallery-photo'
        const unique = `${Date.now()}-${randomUUID().slice(0, 8)}-${index + 1}`
        const desktopName = `${baseName}-${unique}_1600.webp`
        const mobileName = `${baseName}-${unique}_900.webp`

        const desktopPath = path.join(GALLERY_UPLOAD_DIR, desktopName)
        const mobilePath = path.join(GALLERY_UPLOAD_DIR, mobileName)

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

        const fallbackAlt = fileNameToAlt(file.name)
        createdItems.push({
          id: randomUUID(),
          desktop: `/uploads/gallery/${desktopName}`,
          mobile: `/uploads/gallery/${mobileName}`,
          alt: altPrefix ? `${altPrefix} ${index + 1}` : fallbackAlt,
          tag,
          ratio,
          createdAt: new Date().toISOString(),
        })
      } catch (error) {
        console.error('[POST /api/admin/gallery] File processing error:', file.name, error)
        skipped.push({ file: file.name, reason: 'Не удалось обработать файл.' })
      }
    }

    if (createdItems.length === 0) {
      return NextResponse.json(
        { error: 'Не удалось обработать файлы.', skipped },
        { status: 400 }
      )
    }

    const allItems = await addManagedGalleryItems(createdItems)
    return NextResponse.json({
      success: true,
      created: createdItems,
      skipped,
      total: allItems.length,
    })
  } catch (error) {
    console.error('[POST /api/admin/gallery]', error)
    return NextResponse.json({ error: 'Ошибка сервера.' }, { status: 500 })
  }
}
