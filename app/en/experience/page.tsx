import type { Metadata } from 'next'
import ExperiencePageClient from '../../experience/ExperiencePageClient'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'

export const metadata: Metadata = {
  title: 'Experiences | Neue Liebe',
  description:
    'Discover the summer terrace, banquet hall and dance and event evenings at Neue Liebe in Nebra (Unstrut).',
  keywords: 'Neue Liebe experiences, terrace Nebra, banquet hall Nebra, events Nebra, dance evenings Nebra',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/en/experience',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/experience',
      'en-US': 'https://www.neueliebe-nebra.de/en/experience',
      'x-default': 'https://www.neueliebe-nebra.de/experience',
    },
  },
  openGraph: {
    title: 'Experiences | Neue Liebe',
    description:
      'Discover the summer terrace, elegant banquet hall and memorable event evenings at Neue Liebe.',
    url: 'https://www.neueliebe-nebra.de/en/experience',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
}

const experiencePageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Experiences | Neue Liebe',
  description:
    'Discover the summer terrace, banquet hall and dance and event evenings at Neue Liebe in Nebra (Unstrut).',
  url: 'https://www.neueliebe-nebra.de/en/experience',
  inLanguage: 'en-US',
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
      name: 'Experiences',
      item: 'https://www.neueliebe-nebra.de/en/experience',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('experience', 'en', 'https://www.neueliebe-nebra.de/en/experience')

export default function EnglishExperiencePage() {
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
      <ExperiencePageClient initialLang="en" />
    </>
  )
}
