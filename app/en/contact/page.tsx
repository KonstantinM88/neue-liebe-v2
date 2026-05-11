import type { Metadata } from 'next'
import ContactPageClient from '../../contact/ContactPageClient'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'
import { buildContactStructuredData } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Contact | Neue Liebe',
  description:
    'Contact details, address, opening hours and directions to Neue Liebe in Nebra (Unstrut).',
  keywords: 'Neue Liebe contact, Nebra restaurant address, Neue Liebe opening hours, directions restaurant Nebra',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/en/contact',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/contact',
      'en-US': 'https://www.neueliebe-nebra.de/en/contact',
      'x-default': 'https://www.neueliebe-nebra.de/contact',
    },
  },
  openGraph: {
    title: 'Contact | Neue Liebe',
    description:
      'Address, opening hours and directions to Neue Liebe in Nebra (Unstrut).',
    url: 'https://www.neueliebe-nebra.de/en/contact',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
}

const contactPageStructuredData = buildContactStructuredData('en', 'https://www.neueliebe-nebra.de/en/contact')

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
      name: 'Contact',
      item: 'https://www.neueliebe-nebra.de/en/contact',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('contact', 'en', 'https://www.neueliebe-nebra.de/en/contact')

export default function EnglishContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <ContactPageClient initialLang="en" />
    </>
  )
}
