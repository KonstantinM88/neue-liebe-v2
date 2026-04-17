import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Neue Liebe',
    short_name: 'Neue Liebe',
    description:
      'Restaurant Neue Liebe in Nebra (Unstrut) mit Terrasse, regionaler Kuche und besonderen Events.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1714',
    theme_color: '#1a1714',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
