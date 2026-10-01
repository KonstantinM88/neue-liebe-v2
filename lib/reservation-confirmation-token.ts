import 'server-only'

import { createHmac, timingSafeEqual } from 'node:crypto'

const tokenLifetimeSeconds = 60 * 60 * 24 * 14
const tokenPurpose = 'neue-liebe:reservation-confirmation:v1'

function signingSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET
  return secret && secret.length >= 32 ? secret : null
}

function signatureFor(id: string, expiresAt: number, secret: string): string {
  return createHmac('sha256', secret)
    .update(`${tokenPurpose}:${id}:${expiresAt}`)
    .digest('base64url')
}

export function createReservationConfirmationToken(id: string): string | null {
  const secret = signingSecret()
  if (!secret || !/^[a-z0-9]{20,40}$/.test(id)) return null

  const expiresAt = Math.floor(Date.now() / 1000) + tokenLifetimeSeconds
  return `${id}.${expiresAt}.${signatureFor(id, expiresAt, secret)}`
}

export function verifyReservationConfirmationToken(token: string): string | null {
  const secret = signingSecret()
  if (!secret || token.length > 200) return null

  const match = /^([a-z0-9]{20,40})\.(\d{10})\.([A-Za-z0-9_-]{43})$/.exec(token)
  if (!match) return null

  const [, id, expiry, signature] = match
  const expiresAt = Number(expiry)
  const now = Math.floor(Date.now() / 1000)
  if (expiresAt < now || expiresAt > now + tokenLifetimeSeconds) return null

  const expected = signatureFor(id, expiresAt, secret)
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected)) ? id : null
}

export function reservationActionUrl(origin: string, path: string, token: string): string {
  const requested = new URL(origin)
  const isLoopback = ['localhost', '127.0.0.1', '[::1]'].includes(requested.hostname)
  const isPrivateNetwork = /^(?:10|192\.168)\.\d{1,3}\.\d{1,3}$/.test(requested.hostname)
    || /^172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(requested.hostname)
  let base = 'https://www.neueliebe-nebra.de'

  if (process.env.NODE_ENV === 'development') {
    const configured = process.env.RESERVATION_CONFIRM_DEV_URL?.trim()
    if (configured) {
      try {
        const url = new URL(configured)
        const trustedHost = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
          || /^(?:10|192\.168)\.\d{1,3}\.\d{1,3}$/.test(url.hostname)
          || /^172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(url.hostname)
        if (trustedHost && ['http:', 'https:'].includes(url.protocol)
          && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash) {
          base = url.origin
        }
      } catch {
        // Ignore invalid local overrides and use the request origin below.
      }
    }
    if (base === 'https://www.neueliebe-nebra.de' && (isLoopback || isPrivateNetwork)) {
      base = requested.origin
    }
  }
  return `${base}${path}#token=${encodeURIComponent(token)}`
}

export function reservationConfirmationUrl(origin: string, token: string): string {
  return reservationActionUrl(origin, '/reservations/confirm', token)
}
