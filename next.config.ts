import type { NextConfig } from 'next'

const immutableAssetExtensions = 'avif|gif|ico|jpg|jpeg|png|svg|webp|mp4|webm'

const nextConfig: NextConfig = {
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
