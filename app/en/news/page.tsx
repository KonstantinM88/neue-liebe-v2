import type { Metadata } from 'next'
import NewsIndexPage from '@/components/news/NewsIndexPage'
import { listNewsArticles } from '@/lib/news-store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'News | Neue Liebe',
  description:
    'News, events and current updates from Restaurant Neue Liebe in Nebra (Unstrut).',
  keywords: 'Neue Liebe news, Nebra restaurant news, events Nebra, Neue Liebe events',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/en/news',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/news',
      'en-US': 'https://www.neueliebe-nebra.de/en/news',
      'x-default': 'https://www.neueliebe-nebra.de/news',
    },
  },
  openGraph: {
    title: 'News | Neue Liebe',
    description: 'Current news and events from Neue Liebe in Nebra (Unstrut).',
    url: 'https://www.neueliebe-nebra.de/en/news',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
  other: {
    'geo.region': 'DE-ST',
    'geo.placename': 'Nebra (Unstrut)',
  },
}

export default async function EnglishNewsPage() {
  return <NewsIndexPage locale="en" articles={await listNewsArticles('en')} />
}
