import 'server-only'

import path from 'node:path'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import type { GalleryRatio, ManagedGalleryItem } from '@/lib/gallery-types'

const DATA_DIR = path.join(process.cwd(), 'data')
const GALLERY_FILE_PATH = path.join(DATA_DIR, 'gallery.json')
export const GALLERY_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'gallery')

export function inferGalleryRatio(width?: number | null, height?: number | null): GalleryRatio {
  if (!width || !height) {
    return 'wide'
  }

  const ratio = width / height

  if (ratio > 1.15) {
    return 'wide'
  }

  if (ratio < 0.9) {
    return 'tall'
  }

  return 'square'
}

export function normalizeGalleryTag(tag?: string | null): string {
  const cleaned = String(tag ?? '').trim()
  if (!cleaned) {
    return 'Upload'
  }
  return cleaned.slice(0, 24)
}

export function fileNameToAlt(fileName: string): string {
  const withoutExt = fileName.replace(/\.[^.]+$/, '')
  const cleaned = withoutExt.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
  return cleaned || 'Gallery Photo'
}

export function slugifyBaseName(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}

export async function ensureGalleryStorage(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  await mkdir(GALLERY_UPLOAD_DIR, { recursive: true })
}

export async function readManagedGalleryItems(): Promise<ManagedGalleryItem[]> {
  await ensureGalleryStorage()

  try {
    const raw = await readFile(GALLERY_FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((entry): entry is ManagedGalleryItem => (
      typeof entry?.id === 'string'
      && typeof entry?.desktop === 'string'
      && typeof entry?.mobile === 'string'
      && typeof entry?.alt === 'string'
      && typeof entry?.tag === 'string'
      && typeof entry?.ratio === 'string'
      && typeof entry?.createdAt === 'string'
    ))
  } catch {
    return []
  }
}

async function writeManagedGalleryItems(items: ManagedGalleryItem[]): Promise<void> {
  await ensureGalleryStorage()
  await writeFile(GALLERY_FILE_PATH, JSON.stringify(items, null, 2), 'utf8')
}

export async function addManagedGalleryItems(itemsToAdd: ManagedGalleryItem[]): Promise<ManagedGalleryItem[]> {
  if (itemsToAdd.length === 0) {
    return readManagedGalleryItems()
  }

  const existing = await readManagedGalleryItems()
  const next = [...itemsToAdd, ...existing]
  await writeManagedGalleryItems(next)
  return next
}
