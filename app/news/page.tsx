import type { Metadata } from 'next'
import NewsIndexPage from '@/components/news/NewsIndexPage'
import { listNewsArticles } from '@/lib/news-store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Nachrichten | Neue Liebe',
  description:
    'Nachrichten, Veranstaltungen und aktuelle Hinweise vom Restaurant Neue Liebe in Nebra (Unstrut).',
  keywords: 'Neue Liebe Nachrichten, Restaurant Nebra Nachrichten, Events Nebra, Veranstaltungen Neue Liebe',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/news',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/news',
      'en-US': 'https://www.neueliebe-nebra.de/en/news',
      'x-default': 'https://www.neueliebe-nebra.de/news',
    },
  },
  openGraph: {
    title: 'Nachrichten | Neue Liebe',
    description: 'Aktuelle Nachrichten und Veranstaltungen aus der Neuen Liebe in Nebra (Unstrut).',
    url: 'https://www.neueliebe-nebra.de/news',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
  },
  other: {
    'geo.region': 'DE-ST',
    'geo.placename': 'Nebra (Unstrut)',
  },
}

export default async function NewsPage() {
  return <NewsIndexPage locale="de" articles={await listNewsArticles('de')} />
}
