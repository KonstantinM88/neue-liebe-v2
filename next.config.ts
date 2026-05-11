import type { NextConfig } from 'next'

const immutableAssetExtensions = 'avif|gif|ico|jpg|jpeg|png|svg|webp|mp4|webm'

const nextConfig: NextConfig = {
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
