import type { Metadata } from 'next'
import HomePageClient from '../HomePageClient'

export const metadata: Metadata = {
  title: 'Neue Liebe | Restaurant • Terrace • Dance & Events',
  description:
    'Neue Liebe restaurant in Nebra (Unstrut): regional cuisine, elegant terrace, dance evenings and special events in Saxony-Anhalt.',
  alternates: {
    canonical: 'https://neueliebe-nebra.de/en',
    languages: {
      'de-DE': 'https://neueliebe-nebra.de/',
      'en-US': 'https://neueliebe-nebra.de/en',
    },
  },
  openGraph: {
    title: 'Neue Liebe | Restaurant • Terrace • Dance & Events',
    description:
      'Discover restaurant, terrace, culinary highlights and events at Neue Liebe in Nebra (Unstrut).',
    url: 'https://neueliebe-nebra.de/en',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
}

export default function EnglishHomePage() {
  return <HomePageClient initialLang="en" />
}
