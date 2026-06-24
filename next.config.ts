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

const nextConfig: NextConfig = {
  ...(remotePatterns.length > 0 ? { images: { remotePatterns } } : {}),
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
