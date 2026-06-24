import 'server-only'

import path from 'node:path'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import {
  deleteObjectsBestEffort,
  isObjectStorageConfigured,
  type StoredObject,
  uploadObject,
} from '@/lib/object-storage'

const LOCAL_NEWS_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'news')
const LOCAL_KEY_PREFIX = 'local:news/'

export type NewsStorageDriver = 'local' | 's3'
export type StoredNewsMedia = StoredObject

type UploadNewsMediaInput = {
  fileName: string
  body: Buffer
  contentType: string
}

function safeFileName(value: string): string {
  const fileName = path.basename(value)

  if (!/^[a-zA-Z0-9._-]+$/.test(fileName) || fileName !== value) {
    throw new Error('INVALID_NEWS_MEDIA_FILE_NAME')
  }

  return fileName
}

function localFileNameFromKey(key: string): string | null {
  if (!key.startsWith(LOCAL_KEY_PREFIX)) return null

  try {
    return safeFileName(key.slice(LOCAL_KEY_PREFIX.length))
  } catch {
    return null
  }
}

export function getNewsStorageDriver(): NewsStorageDriver {
  const driver = process.env.NEWS_STORAGE_DRIVER?.trim().toLowerCase() || 'local'

  if (driver !== 'local' && driver !== 's3') {
    throw new Error('INVALID_NEWS_STORAGE_DRIVER')
  }

  return driver
}

export function isNewsMediaStorageConfigured(): boolean {
  try {
    return getNewsStorageDriver() === 'local' || isObjectStorageConfigured()
  } catch {
    return false
  }
}

export async function uploadNewsMedia(
  input: UploadNewsMediaInput
): Promise<StoredNewsMedia> {
  const fileName = safeFileName(input.fileName)

  if (getNewsStorageDriver() === 's3') {
    return uploadObject({
      relativeKey: `news/${fileName}`,
      body: input.body,
      contentType: input.contentType,
    })
  }

  await mkdir(LOCAL_NEWS_UPLOAD_DIR, { recursive: true })
  await writeFile(path.join(LOCAL_NEWS_UPLOAD_DIR, fileName), input.body)

  return {
    key: `${LOCAL_KEY_PREFIX}${fileName}`,
    url: `/uploads/news/${fileName}`,
  }
}

async function deleteLocalNewsMedia(key: string): Promise<void> {
  const fileName = localFileNameFromKey(key)
  if (!fileName) return

  await rm(path.join(LOCAL_NEWS_UPLOAD_DIR, fileName), { force: true })
}

export async function deleteNewsMediaBestEffort(
  keys: Array<string | null | undefined>
): Promise<void> {
  const uniqueKeys = [...new Set(keys.filter((key): key is string => Boolean(key)))]
  if (uniqueKeys.length === 0) return

  const localKeys = uniqueKeys.filter((key) => localFileNameFromKey(key))
  const objectKeys = uniqueKeys.filter((key) => !key.startsWith(LOCAL_KEY_PREFIX))

  const localResults = await Promise.allSettled(localKeys.map(deleteLocalNewsMedia))
  for (const [index, result] of localResults.entries()) {
    if (result.status === 'rejected') {
      console.error('[Local news media delete]', localKeys[index], result.reason)
    }
  }

  await deleteObjectsBestEffort(objectKeys)
}
