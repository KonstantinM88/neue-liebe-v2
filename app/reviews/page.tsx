import type { Metadata } from 'next'
import ReviewsPageClient from './ReviewsPageClient'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'

export const metadata: Metadata = {
  title: 'Bewertungen | Neue Liebe',
  description:
    'Lesen Sie Bewertungen und Erfahrungen unserer Gäste über Restaurant, Service und Atmosphäre der Neuen Liebe in Nebra (Unstrut).',
  keywords: 'Bewertungen Neue Liebe, Restaurant Bewertungen Nebra, Google Reviews Neue Liebe, Restaurant Erfahrung Nebra',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/reviews',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/reviews',
      'en-US': 'https://www.neueliebe-nebra.de/en/reviews',
      'x-default': 'https://www.neueliebe-nebra.de/reviews',
    },
  },
  openGraph: {
    title: 'Bewertungen | Neue Liebe',
    description:
      'Erfahrungen und Stimmen unserer Gäste über Restaurant, Küche und Atmosphäre der Neuen Liebe.',
    url: 'https://www.neueliebe-nebra.de/reviews',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
  },
}

const reviewsPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Bewertungen | Neue Liebe',
  description:
    'Lesen Sie Bewertungen und Erfahrungen unserer Gäste über Restaurant, Service und Atmosphäre der Neuen Liebe in Nebra (Unstrut).',
  url: 'https://www.neueliebe-nebra.de/reviews',
}

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
      name: 'Bewertungen',
      item: 'https://www.neueliebe-nebra.de/reviews',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('reviews', 'de', 'https://www.neueliebe-nebra.de/reviews')

export default function ReviewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsPageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <ReviewsPageClient />
    </>
  )
}
