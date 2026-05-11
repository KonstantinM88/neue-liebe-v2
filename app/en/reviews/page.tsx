import type { Metadata } from 'next'
import ReviewsPageClient from '../../reviews/ReviewsPageClient'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'

export const metadata: Metadata = {
  title: 'Reviews | Neue Liebe',
  description:
    'Read guest reviews and experiences about the restaurant, service and atmosphere at Neue Liebe in Nebra (Unstrut).',
  keywords: 'Neue Liebe reviews, Nebra restaurant reviews, Google reviews Neue Liebe, Nebra dining experience',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/en/reviews',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/reviews',
      'en-US': 'https://www.neueliebe-nebra.de/en/reviews',
      'x-default': 'https://www.neueliebe-nebra.de/reviews',
    },
  },
  openGraph: {
    title: 'Reviews | Neue Liebe',
    description:
      'Guest experiences and reviews about the restaurant, cuisine and atmosphere at Neue Liebe.',
    url: 'https://www.neueliebe-nebra.de/en/reviews',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
}

const reviewsPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Reviews | Neue Liebe',
  description:
    'Read guest reviews and experiences about the restaurant, service and atmosphere at Neue Liebe in Nebra (Unstrut).',
  url: 'https://www.neueliebe-nebra.de/en/reviews',
}

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://www.neueliebe-nebra.de/en',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Reviews',
      item: 'https://www.neueliebe-nebra.de/en/reviews',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('reviews', 'en', 'https://www.neueliebe-nebra.de/en/reviews')

export default function EnglishReviewsPage() {
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
      <ReviewsPageClient initialLang="en" />
    </>
  )
}
