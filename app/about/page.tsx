import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'

export const metadata: Metadata = {
  title: 'Über uns | Neue Liebe',
  description:
    'Erfahren Sie mehr über die Neue Liebe in Nebra (Unstrut): unsere Geschichte, regionale Küche, Atmosphäre und Gastfreundschaft.',
  keywords: 'Über Neue Liebe, Restaurant Nebra Geschichte, Restaurant Nebra Über uns, Neue Liebe Nebra',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/about',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/about',
      'en-US': 'https://www.neueliebe-nebra.de/en/about',
      'x-default': 'https://www.neueliebe-nebra.de/about',
    },
  },
  openGraph: {
    title: 'Über uns | Neue Liebe',
    description:
      'Die Geschichte der Neuen Liebe in Nebra (Unstrut), unsere Werte und was einen Besuch bei uns besonders macht.',
    url: 'https://www.neueliebe-nebra.de/about',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
  },
}

const aboutPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Über uns | Neue Liebe',
  description:
    'Erfahren Sie mehr über die Neue Liebe in Nebra (Unstrut): unsere Geschichte, regionale Küche, Atmosphäre und Gastfreundschaft.',
  url: 'https://www.neueliebe-nebra.de/about',
  inLanguage: 'de-DE',
  mainEntity: {
    '@type': 'Restaurant',
    name: 'Neue Liebe',
    url: 'https://www.neueliebe-nebra.de',
    telephone: '+49 34461 599804',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Wetzendorfer Str. 10',
      postalCode: '06642',
      addressLocality: 'Nebra (Unstrut)',
      addressCountry: 'DE',
    },
    areaServed: 'Sachsen-Anhalt',
  },
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
      name: 'Über uns',
      item: 'https://www.neueliebe-nebra.de/about',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('about', 'de', 'https://www.neueliebe-nebra.de/about')

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <AboutPageClient />
    </>
  )
}
