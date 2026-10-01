import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'

type AdminSessionPayload = {
  u: string
  exp: number
}

export const ADMIN_COOKIE_NAME = 'nl_admin_session'
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getAdminSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET
  return secret && secret.length >= 32 ? secret : null
}

function getAdminUsername(): string | null {
  return process.env.ADMIN_USERNAME?.trim() || null
}

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null
}

function signPayload(payloadBase64: string): string | null {
  const secret = getAdminSecret()
  if (!secret) return null
  return createHmac('sha256', secret)
    .update(payloadBase64)
    .digest('base64url')
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a)
  const bufferB = Buffer.from(b)

  if (bufferA.length !== bufferB.length) {
    return false
  }

  return timingSafeEqual(bufferA, bufferB)
}

export function checkAdminCredentials(username: string, password: string): boolean {
  const configuredUsername = getAdminUsername()
  const configuredPassword = getAdminPassword()
  if (!configuredUsername || !configuredPassword || !getAdminSecret()) return false
  const normalizedUsername = String(username).trim()
  const normalizedPassword = String(password)

  return safeEqual(normalizedUsername, configuredUsername) && safeEqual(normalizedPassword, configuredPassword)
}

export function createAdminSessionToken(username: string): string {
  const payload: AdminSessionPayload = {
    u: username,
    exp: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000,
  }

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = signPayload(payloadBase64)
  if (!signature) throw new Error('Admin session secret is not configured')
  return `${payloadBase64}.${signature}`
}

export function verifyAdminSessionToken(token?: string | null): boolean {
  if (!token) {
    return false
  }

  const [payloadBase64, signature] = token.split('.')

  if (!payloadBase64 || !signature) {
    return false
  }

  const expectedSignature = signPayload(payloadBase64)
  if (!expectedSignature || !safeEqual(signature, expectedSignature)) {
    return false
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8')) as AdminSessionPayload
    if (!payload?.u || !payload?.exp) {
      return false
    }
    return payload.exp > Date.now()
  } catch {
    return false
  }
}
