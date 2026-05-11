import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Neue Liebe – Restaurant • Terrasse • Tanz & Events',
  description:
    'Restaurant Neue Liebe – Ihr Restaurant in Nebra (Unstrut). Genießen Sie exquisite Küche, eine romantische Terrasse und unvergessliche Events.',
  keywords: 'Restaurant Nebra, Restaurant Unstrut, Restaurant Nebra Terrasse, Neue Liebe Nebra, Restaurant Sachsen-Anhalt',
  applicationName: 'Neue Liebe',
  metadataBase: new URL('https://www.neueliebe-nebra.de'),
  manifest: '/manifest.webmanifest',
  category: 'food',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'Neue Liebe – Restaurant • Terrasse • Tanz & Events',
    description: 'Exquisite Küche, romantische Terrasse und unvergessliche Events in Nebra (Unstrut).',
    url: '/',
    siteName: 'Neue Liebe',
    locale: 'de_DE',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Neue Liebe - Restaurant, Terrasse, Tanz & Events in Nebra (Unstrut)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neue Liebe – Restaurant • Terrasse • Tanz & Events',
    description: 'Exquisite Küche, romantische Terrasse und unvergessliche Events in Nebra (Unstrut).',
    images: ['/twitter-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1714',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  )
}
