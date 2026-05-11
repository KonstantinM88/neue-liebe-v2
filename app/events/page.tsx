import type { Metadata } from 'next'
import EventsPageClient from './EventsPageClient'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'
import { buildEventsStructuredData } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Events | Neue Liebe',
  description:
    'Hochzeiten, Firmenfeiern und Tanzabende in der Neuen Liebe in Nebra (Unstrut) mit stilvollen Räumen und passender Kulinarik.',
  keywords: 'Events Nebra, Hochzeit Nebra, Firmenfeier Nebra, Tanzabend Nebra, Eventlocation Nebra',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/events',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/events',
      'en-US': 'https://www.neueliebe-nebra.de/en/events',
      'x-default': 'https://www.neueliebe-nebra.de/events',
    },
  },
  openGraph: {
    title: 'Events | Neue Liebe',
    description:
      'Entdecken Sie Hochzeiten, Firmenfeiern und Tanzabende in der Neuen Liebe in Nebra (Unstrut).',
    url: 'https://www.neueliebe-nebra.de/events',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
  },
}

const eventsPageStructuredData = buildEventsStructuredData('de', 'https://www.neueliebe-nebra.de/events')

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Startseite',
      item: 'https://www.neueliebe-nebra.de/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Events',
      item: 'https://www.neueliebe-nebra.de/events',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('events', 'de', 'https://www.neueliebe-nebra.de/events')

export default function EventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsPageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <EventsPageClient />
    </>
  )
}
