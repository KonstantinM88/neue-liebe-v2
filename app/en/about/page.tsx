import type { Metadata } from 'next'
import AboutPageClient from '../../about/AboutPageClient'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'

export const metadata: Metadata = {
  title: 'About Us | Neue Liebe',
  description:
    'Learn more about Neue Liebe in Nebra (Unstrut): our story, regional cuisine, atmosphere and hospitality.',
  keywords: 'About Neue Liebe, Nebra restaurant story, Neue Liebe restaurant, Nebra hospitality',
  alternates: {
    canonical: 'https://neueliebe-nebra.de/en/about',
    languages: {
      'de-DE': 'https://neueliebe-nebra.de/about',
      'en-US': 'https://neueliebe-nebra.de/en/about',
    },
  },
  openGraph: {
    title: 'About Us | Neue Liebe',
    description:
      'The story of Neue Liebe in Nebra (Unstrut), our values and what makes a visit special.',
    url: 'https://neueliebe-nebra.de/en/about',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
}

const aboutPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Us | Neue Liebe',
  description:
    'Learn more about Neue Liebe in Nebra (Unstrut): our story, regional cuisine, atmosphere and hospitality.',
  url: 'https://neueliebe-nebra.de/en/about',
  inLanguage: 'en-US',
  mainEntity: {
    '@type': 'Restaurant',
    name: 'Neue Liebe',
    url: 'https://neueliebe-nebra.de/en',
    telephone: '+49 34461 599804',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Wetzendorfer Str. 10',
      postalCode: '06642',
      addressLocality: 'Nebra (Unstrut)',
      addressCountry: 'DE',
    },
    areaServed: 'Saxony-Anhalt',
  },
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
      name: 'About Us',
      item: 'https://neueliebe-nebra.de/en/about',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('about', 'en', 'https://neueliebe-nebra.de/en/about')

export default function EnglishAboutPage() {
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
      <AboutPageClient initialLang="en" />
    </>
  )
}
