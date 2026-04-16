import type { Metadata } from 'next'
import EventsPageClient from '../../events/EventsPageClient'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'

export const metadata: Metadata = {
  title: 'Events | Neue Liebe',
  description:
    'Weddings, corporate events and dance evenings at Neue Liebe in Nebra (Unstrut) with stylish spaces and fitting cuisine.',
  keywords: 'Events Nebra, wedding venue Nebra, corporate event Nebra, dance evening Nebra, event location Nebra',
  alternates: {
    canonical: 'https://neueliebe-nebra.de/en/events',
    languages: {
      'de-DE': 'https://neueliebe-nebra.de/events',
      'en-US': 'https://neueliebe-nebra.de/en/events',
    },
  },
  openGraph: {
    title: 'Events | Neue Liebe',
    description:
      'Discover weddings, corporate events and dance evenings at Neue Liebe in Nebra (Unstrut).',
    url: 'https://neueliebe-nebra.de/en/events',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
}

const eventsPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'EventVenue',
  name: 'Events | Neue Liebe',
  description:
    'Weddings, corporate events and dance evenings at Neue Liebe in Nebra (Unstrut) with stylish spaces and fitting cuisine.',
  url: 'https://neueliebe-nebra.de/en/events',
}

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://neueliebe-nebra.de/en',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Events',
      item: 'https://neueliebe-nebra.de/en/events',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('events', 'en', 'https://neueliebe-nebra.de/en/events')

export default function EnglishEventsPage() {
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
      <EventsPageClient initialLang="en" />
    </>
  )
}
