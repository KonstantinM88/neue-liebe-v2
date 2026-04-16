import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'

export const metadata: Metadata = {
  title: 'Neue Liebe – Restaurant • Terrasse • Tanz & Events',
  description:
    'Restaurant Neue Liebe in Nebra (Unstrut): regionale Küche, stilvolle Terrasse, Tanzabende und besondere Events in Sachsen-Anhalt.',
  alternates: {
    canonical: 'https://neueliebe-nebra.de/',
    languages: {
      'de-DE': 'https://neueliebe-nebra.de/',
      'en-US': 'https://neueliebe-nebra.de/en',
    },
  },
  openGraph: {
    title: 'Neue Liebe – Restaurant • Terrasse • Tanz & Events',
    description:
      'Entdecken Sie Restaurant, Terrasse, Kulinarik und Events der Neuen Liebe in Nebra (Unstrut).',
    url: 'https://neueliebe-nebra.de/',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
  },
}

export default function HomePage() {
  return <HomePageClient />
}
