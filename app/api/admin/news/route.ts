import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from '@/lib/admin-auth'
import {
  deleteNewsArticles,
  ensureNewsStorage,
  isValidNewsSlug,
  listAdminNewsEntries,
  NEWS_UPLOAD_DIR,
  readNewsArticle,
  saveNewsArticles,
  slugifyNewsSlug,
} from '@/lib/news-store'
import type { NewsArticle, NewsLocale, SaveNewsInput } from '@/lib/news-types'

export const runtime = 'nodejs'

const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024
const DEFAULT_NEWS_IMAGE = '/events2_1200.webp'
const DEFAULT_NEWS_IMAGE_MOBILE = '/events2_800.webp'

function isAdminAuthorized(req: NextRequest): boolean {
  return verifyAdminSessionToken(req.cookies.get(ADMIN_COOKIE_NAME)?.value)
}

function normalizeText(value: FormDataEntryValue | null, maxLength: number): string {
  return String(value ?? '')
    .trim()
    .replace(/\r\n/g, '\n')
    .slice(0, maxLength)
}

function normalizeLineList(value: FormDataEntryValue | null, maxItems = 20): string[] {
  return String(value ?? '')
    .split(/\r?\n|,/)
    .map((item) => item.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, maxItems)
}

function normalizePublishedAt(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null

  const date = new Date(`${value}T10:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function localizedArticleInput(
  formData: FormData,
  locale: NewsLocale,
  existing: NewsArticle | null
): SaveNewsInput[NewsLocale] {
  const suffix = locale === 'de' ? 'De' : 'En'
  const title = normalizeText(formData.get(`title${suffix}`), 140)
  const excerpt = normalizeText(formData.get(`excerpt${suffix}`), 320)
  const body = normalizeText(formData.get(`body${suffix}`), 40000)
  const seoTitle = normalizeText(formData.get(`seoTitle${suffix}`), 70) || title
  const seoDescription =
    normalizeText(formData.get(`seoDescription${suffix}`), 170) || excerpt
  const category =
    normalizeText(formData.get(`category${suffix}`), 60)
    || (locale === 'de' ? 'Nachrichten' : 'News')
  const coverAlt =
    normalizeText(formData.get(`coverAlt${suffix}`), 160)
    || existing?.coverAlt
    || title

  return {
    title,
    excerpt,
    body,
    seoTitle,
    seoDescription,
    keywords: normalizeLineList(formData.get(`keywords${suffix}`)),
    keyFacts: normalizeLineList(formData.get(`keyFacts${suffix}`), 12),
    category,
    coverAlt,
  }
}

async function processCoverImage(file: File): Promise<{
  coverImage: string
  coverImageMobile: string
}> {
  if (!file.type.startsWith('image/')) {
    throw new Error('INVALID_IMAGE_TYPE')
  }

  const sourceBuffer = Buffer.from(await file.arrayBuffer())
  if (sourceBuffer.length === 0) {
    throw new Error('EMPTY_IMAGE')
  }
  if (sourceBuffer.length > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('IMAGE_TOO_LARGE')
  }

  await ensureNewsStorage()

  const baseName =
    slugifyNewsSlug(file.name.replace(/\.[^.]+$/, ''))
    || 'news-cover'
  const unique = `${Date.now()}-${randomUUID().slice(0, 8)}`
  const desktopName = `${baseName}-${unique}_1600.webp`
  const mobileName = `${baseName}-${unique}_900.webp`
  const image = sharp(sourceBuffer).rotate()

  const [desktopWebp, mobileWebp] = await Promise.all([
    image
      .clone()
      .resize({ width: 1600, height: 900, fit: 'cover', position: 'centre' })
      .webp({ quality: 84 })
      .toBuffer(),
    image
      .clone()
      .resize({ width: 900, height: 675, fit: 'cover', position: 'centre' })
      .webp({ quality: 82 })
      .toBuffer(),
  ])

  await Promise.all([
    writeFile(path.join(NEWS_UPLOAD_DIR, desktopName), desktopWebp),
    writeFile(path.join(NEWS_UPLOAD_DIR, mobileName), mobileWebp),
  ])

  return {
    coverImage: `/uploads/news/${desktopName}`,
    coverImageMobile: `/uploads/news/${mobileName}`,
  }
}

function revalidateNewsPaths(slug: string, previousSlug?: string): void {
  revalidatePath('/news')
  revalidatePath('/en/news')
  revalidatePath(`/news/${slug}`)
  revalidatePath(`/en/news/${slug}`)
  revalidatePath('/sitemap.xml')

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/news/${previousSlug}`)
    revalidatePath(`/en/news/${previousSlug}`)
  }
}

export async function GET(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return NextResponse.json({ entries: await listAdminNewsEntries() })
  } catch (error) {
    console.error('[GET /api/admin/news]', error)
    return NextResponse.json({ error: 'Nachrichten konnten nicht geladen werden.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const action = normalizeText(formData.get('action'), 20)

    if (action === 'delete') {
      const slug = slugifyNewsSlug(normalizeText(formData.get('slug'), 80))
      if (!isValidNewsSlug(slug)) {
        return NextResponse.json({ error: 'Ungültiger Slug.' }, { status: 400 })
      }

      await deleteNewsArticles(slug)
      revalidateNewsPaths(slug)
      return NextResponse.json({ success: true })
    }

    if (action !== 'save') {
      return NextResponse.json({ error: 'Unbekannte Aktion.' }, { status: 400 })
    }

    const originalSlug = slugifyNewsSlug(normalizeText(formData.get('originalSlug'), 80))
    const slug = slugifyNewsSlug(normalizeText(formData.get('slug'), 80))
    const publishedAt = normalizePublishedAt(normalizeText(formData.get('publishedAt'), 10))

    if (!isValidNewsSlug(slug)) {
      return NextResponse.json(
        { error: 'Der Slug darf nur lateinische Buchstaben, Zahlen und Bindestriche enthalten.' },
        { status: 400 }
      )
    }
    if (!publishedAt) {
      return NextResponse.json({ error: 'Bitte geben Sie ein gültiges Veröffentlichungsdatum an.' }, { status: 400 })
    }

    const [existingDe, existingEn, targetDe, targetEn] = await Promise.all([
      originalSlug
        ? readNewsArticle('de', originalSlug, { includeDrafts: true })
        : Promise.resolve(null),
      originalSlug
        ? readNewsArticle('en', originalSlug, { includeDrafts: true })
        : Promise.resolve(null),
      readNewsArticle('de', slug, { includeDrafts: true }),
      readNewsArticle('en', slug, { includeDrafts: true }),
    ])

    if (!originalSlug && (targetDe || targetEn)) {
      return NextResponse.json({ error: 'Eine Nachricht mit diesem Slug existiert bereits.' }, { status: 409 })
    }
    if (originalSlug && originalSlug !== slug && (targetDe || targetEn)) {
      return NextResponse.json({ error: 'Der neue Slug wird bereits verwendet.' }, { status: 409 })
    }

    const de = localizedArticleInput(formData, 'de', existingDe)
    const en = localizedArticleInput(formData, 'en', existingEn)

    if (!de.title || !de.excerpt || !de.body || !en.title || !en.excerpt || !en.body) {
      return NextResponse.json(
        { error: 'Titel, Kurzbeschreibung und Markdown-Inhalt sind für DE und EN erforderlich.' },
        { status: 400 }
      )
    }

    let coverImage =
      existingDe?.coverImage
      ?? existingEn?.coverImage
      ?? DEFAULT_NEWS_IMAGE
    let coverImageMobile =
      existingDe?.coverImageMobile
      ?? existingEn?.coverImageMobile
      ?? DEFAULT_NEWS_IMAGE_MOBILE

    const photoEntry = formData.get('cover')
    if (photoEntry instanceof File && photoEntry.size > 0) {
      const processed = await processCoverImage(photoEntry)
      coverImage = processed.coverImage
      coverImageMobile = processed.coverImageMobile
    }

    const entry = await saveNewsArticles({
      slug,
      originalSlug: originalSlug || undefined,
      author: normalizeText(formData.get('author'), 100) || 'Neue Liebe',
      publishedAt,
      draft: formData.get('draft') === 'true',
      coverImage,
      coverImageMobile,
      de,
      en,
    })

    revalidateNewsPaths(slug, originalSlug)
    return NextResponse.json({ success: true, entry })
  } catch (error) {
    console.error('[POST /api/admin/news]', error)

    const code = error instanceof Error ? error.message : ''
    if (code === 'INVALID_IMAGE_TYPE') {
      return NextResponse.json({ error: 'Die Titelgrafik muss ein Bild sein.' }, { status: 400 })
    }
    if (code === 'EMPTY_IMAGE') {
      return NextResponse.json({ error: 'Die Bilddatei ist leer.' }, { status: 400 })
    }
    if (code === 'IMAGE_TOO_LARGE') {
      return NextResponse.json({ error: 'Das Bild ist zu groß. Maximum: 25 MB.' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Nachrichten konnten nicht gespeichert werden.' }, { status: 500 })
  }
}
