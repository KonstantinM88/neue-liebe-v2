import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'
import { reservationActionUrl } from '@/lib/reservation-confirmation-token'

const tokenPurpose = 'neue-liebe:reservation-cancellation:v1'
const reservationIdPattern = /^[a-z0-9]{20,40}$/

function signingSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET
  return secret && secret.length >= 32 ? secret : null
}

function signatureFor(id: string, version: number, secret: string): string {
  const payload = version === 1 ? `${tokenPurpose}:${id}` : `${tokenPurpose}:v2:${id}:${version}`
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createReservationCancellationToken(id: string, version = 1): string | null {
  const secret = signingSecret()
  if (!secret || !reservationIdPattern.test(id) || !Number.isSafeInteger(version) || version < 1) return null
  const signature = signatureFor(id, version, secret)
  return version === 1 ? `${id}.${signature}` : `${id}.${version}.${signature}`
}

export function reservationCancellationTokenId(token: string): string | null {
  if (token.length > 110) return null
  const match = /^([a-z0-9]{20,40})\.(?:(\d{1,9})\.)?([A-Za-z0-9_-]{43})$/.exec(token)
  return match?.[1] ?? null
}

export function verifyReservationCancellationToken(token: string, currentVersion: number): boolean {
  const secret = signingSecret()
  if (!secret || token.length > 110) return false

  const match = /^([a-z0-9]{20,40})\.(?:(\d{1,9})\.)?([A-Za-z0-9_-]{43})$/.exec(token)
  if (!match) return false

  const [, id, explicitVersion, signature] = match
  const version = explicitVersion ? Number(explicitVersion) : 1
  if (version !== currentVersion) return false
  const expected = signatureFor(id, version, secret)
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
}

export function reservationCancellationUrl(origin: string, token: string, lang: string): string {
  return reservationActionUrl(origin, `/reservations/cancel${lang === 'en' ? '?lang=en' : ''}`, token)
}
