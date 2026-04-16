import type { Metadata } from 'next'
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
  metadataBase: new URL('https://neueliebe-nebra.de'),
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
  },
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
