import type { Metadata } from 'next'
import ExperiencePageClient from './ExperiencePageClient'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'

export const metadata: Metadata = {
  title: 'Erlebnisse | Neue Liebe',
  description:
    'Erleben Sie Sommerterrasse, Bankettsaal sowie Tanz- und Eventabende der Neuen Liebe in Nebra (Unstrut).',
  keywords: 'Erlebnisse Neue Liebe, Terrasse Nebra, Bankettsaal Nebra, Events Nebra, Tanzabend Nebra',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/experience',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/experience',
      'en-US': 'https://www.neueliebe-nebra.de/en/experience',
      'x-default': 'https://www.neueliebe-nebra.de/experience',
    },
  },
  openGraph: {
    title: 'Erlebnisse | Neue Liebe',
    description:
      'Sommerterrasse, eleganter Bankettsaal und besondere Eventabende in der Neuen Liebe.',
    url: 'https://www.neueliebe-nebra.de/experience',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
  },
}

const experiencePageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Erlebnisse | Neue Liebe',
  description:
    'Erleben Sie Sommerterrasse, Bankettsaal sowie Tanz- und Eventabende der Neuen Liebe in Nebra (Unstrut).',
  url: 'https://www.neueliebe-nebra.de/experience',
  inLanguage: 'de-DE',
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
      name: 'Erlebnisse',
      item: 'https://www.neueliebe-nebra.de/experience',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('experience', 'de', 'https://www.neueliebe-nebra.de/experience')

export default function ExperiencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(experiencePageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <ExperiencePageClient />
    </>
  )
}
