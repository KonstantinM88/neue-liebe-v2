import type { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Kontakt | Neue Liebe',
  description:
    'Kontakt, Adresse, Öffnungszeiten und Anfahrt zur Neuen Liebe in Nebra (Unstrut).',
  keywords: 'Kontakt Neue Liebe, Adresse Restaurant Nebra, Öffnungszeiten Neue Liebe, Anfahrt Nebra Restaurant',
  alternates: {
    canonical: 'https://neueliebe-nebra.de/contact',
    languages: {
      'de-DE': 'https://neueliebe-nebra.de/contact',
      'en-US': 'https://neueliebe-nebra.de/en/contact',
    },
  },
  openGraph: {
    title: 'Kontakt | Neue Liebe',
    description:
      'Adresse, Öffnungszeiten und Anfahrt zur Neuen Liebe in Nebra (Unstrut).',
    url: 'https://neueliebe-nebra.de/contact',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
  },
}

const contactPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Kontakt | Neue Liebe',
  description: 'Kontakt, Adresse, Öffnungszeiten und Anfahrt zur Neuen Liebe in Nebra (Unstrut).',
  url: 'https://neueliebe-nebra.de/contact',
}

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Startseite',
      item: 'https://neueliebe-nebra.de/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Kontakt',
      item: 'https://neueliebe-nebra.de/contact',
    },
  ],
}

export default function ContactPage() {
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
      <ContactPageClient />
    </>
  )
}
