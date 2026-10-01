import type { NextConfig } from 'next'

const immutableAssetExtensions = 'avif|gif|ico|jpg|jpeg|png|svg|webp|mp4|webm'

function objectStorageRemotePatterns() {
  const publicUrl = process.env.OBJECT_STORAGE_PUBLIC_URL?.trim()
  if (!publicUrl) return []

  try {
    const url = new URL(publicUrl)
    if (
      (url.protocol !== 'http:' && url.protocol !== 'https:')
      || url.search
      || url.hash
    ) return []

    const basePath = url.pathname.replace(/\/+$/, '')
    return [
      {
        protocol: url.protocol.slice(0, -1) as 'http' | 'https',
        hostname: url.hostname,
        port: url.port,
        pathname: basePath ? `${basePath}/**` : '/**',
      },
    ]
  } catch {
    return []
  }
}

const remotePatterns = objectStorageRemotePatterns()

function localDevOriginHost(): string | null {
  if (process.env.NODE_ENV !== 'development') return null
  const configured = process.env.RESERVATION_CONFIRM_DEV_URL?.trim()
  if (!configured) return null

  try {
    const url = new URL(configured)
    const privateHost = /^(?:10|192\.168)\.\d{1,3}\.\d{1,3}$/.test(url.hostname)
      || /^172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(url.hostname)
    return privateHost && ['http:', 'https:'].includes(url.protocol)
      && !url.username && !url.password && url.pathname === '/' && !url.search && !url.hash
      ? url.hostname
      : null
  } catch {
    return null
  }
}

const devOriginHost = localDevOriginHost()

const nextConfig: NextConfig = {
  ...(remotePatterns.length > 0 ? { images: { remotePatterns } } : {}),
  ...(devOriginHost ? { allowedDevOrigins: [devOriginHost] } : {}),
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'neueliebe-nebra.de',
          },
        ],
        destination: 'https://www.neueliebe-nebra.de/:path*',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/reservations/confirm',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: '/reservations/cancel',
        headers: [
          { key: 'Cache-Control', value: 'private, no-store' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
        ],
      },
      {
        source: `/:path*.:ext(${immutableAssetExtensions})`,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
