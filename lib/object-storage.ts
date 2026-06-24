import 'server-only'

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  type S3ClientConfig,
} from '@aws-sdk/client-s3'

const DEFAULT_PREFIX = 'neue-liebe'
const IMMUTABLE_CACHE_CONTROL = 'public, max-age=31536000, immutable'

type ObjectStorageConfig = {
  bucket: string
  publicUrl: string
  prefix: string
  clientConfig: S3ClientConfig
}

type UploadObjectInput = {
  relativeKey: string
  body: Buffer
  contentType: string
}

export type StoredObject = {
  key: string
  url: string
}

let cachedClient: S3Client | null = null
let cachedClientSignature = ''

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) throw new Error('OBJECT_STORAGE_NOT_CONFIGURED')
  return value
}

function normalizePrefix(value: string): string {
  const normalized = value
    .replace(/\\/g, '/')
    .split('/')
    .map((segment) => segment.trim().replace(/[^a-zA-Z0-9._-]+/g, '-'))
    .filter(Boolean)
    .join('/')

  return normalized || DEFAULT_PREFIX
}

function normalizeRelativeKey(value: string): string {
  const normalized = value
    .replace(/\\/g, '/')
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/')

  if (!normalized || normalized.includes('..')) {
    throw new Error('INVALID_OBJECT_STORAGE_KEY')
  }

  return normalized
}

function parseBoolean(value: string | undefined): boolean {
  return ['1', 'true', 'yes', 'on'].includes(value?.trim().toLowerCase() ?? '')
}

function readObjectStorageConfig(): ObjectStorageConfig {
  const endpoint = process.env.OBJECT_STORAGE_ENDPOINT?.trim()
  const publicUrlValue = requiredEnv('OBJECT_STORAGE_PUBLIC_URL')
  let publicUrl: URL

  try {
    publicUrl = new URL(publicUrlValue)
  } catch {
    throw new Error('INVALID_OBJECT_STORAGE_PUBLIC_URL')
  }

  if (
    !['http:', 'https:'].includes(publicUrl.protocol)
    || publicUrl.search
    || publicUrl.hash
  ) {
    throw new Error('INVALID_OBJECT_STORAGE_PUBLIC_URL')
  }

  const accessKeyId = requiredEnv('OBJECT_STORAGE_ACCESS_KEY_ID')
  const secretAccessKey = requiredEnv('OBJECT_STORAGE_SECRET_ACCESS_KEY')
  const region = requiredEnv('OBJECT_STORAGE_REGION')
  const bucket = requiredEnv('OBJECT_STORAGE_BUCKET')
  const prefix = normalizePrefix(process.env.OBJECT_STORAGE_PREFIX ?? DEFAULT_PREFIX)

  return {
    bucket,
    publicUrl: publicUrl.toString().replace(/\/+$/, ''),
    prefix,
    clientConfig: {
      region,
      ...(endpoint ? { endpoint } : {}),
      forcePathStyle: parseBoolean(process.env.OBJECT_STORAGE_FORCE_PATH_STYLE),
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    },
  }
}

function getObjectStorageClient(config: ObjectStorageConfig): S3Client {
  const signature = JSON.stringify(config.clientConfig)

  if (!cachedClient || cachedClientSignature !== signature) {
    cachedClient?.destroy()
    cachedClient = new S3Client(config.clientConfig)
    cachedClientSignature = signature
  }

  return cachedClient
}

function objectUrl(publicUrl: string, key: string): string {
  const encodedKey = key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `${publicUrl}/${encodedKey}`
}

export function isObjectStorageConfigured(): boolean {
  try {
    readObjectStorageConfig()
    return true
  } catch {
    return false
  }
}

export function isManagedObjectStorageKey(key: string | null | undefined): key is string {
  if (!key) return false

  const prefix = normalizePrefix(process.env.OBJECT_STORAGE_PREFIX ?? DEFAULT_PREFIX)
  return key.startsWith(`${prefix}/news/`) && !key.includes('..')
}

export async function uploadObject(input: UploadObjectInput): Promise<StoredObject> {
  const config = readObjectStorageConfig()
  const relativeKey = normalizeRelativeKey(input.relativeKey)
  const key = `${config.prefix}/${relativeKey}`

  await getObjectStorageClient(config).send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: IMMUTABLE_CACHE_CONTROL,
    })
  )

  return {
    key,
    url: objectUrl(config.publicUrl, key),
  }
}

export async function deleteObject(key: string): Promise<void> {
  if (!isManagedObjectStorageKey(key)) return

  const config = readObjectStorageConfig()
  await getObjectStorageClient(config).send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: key,
    })
  )
}

export async function deleteObjectsBestEffort(
  keys: Array<string | null | undefined>
): Promise<void> {
  const uniqueKeys = [...new Set(keys.filter(isManagedObjectStorageKey))]
  if (uniqueKeys.length === 0) return

  const results = await Promise.allSettled(uniqueKeys.map((key) => deleteObject(key)))

  for (const [index, result] of results.entries()) {
    if (result.status === 'rejected') {
      console.error('[Object storage delete]', uniqueKeys[index], result.reason)
    }
  }
}
