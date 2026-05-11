import type { Metadata } from 'next'
import MenuPageClient from './MenuPageClient'
import { getPublicMenuData } from '@/lib/menu-public'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'
import { buildMenuStructuredData } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Speisekarte | Neue Liebe',
  description:
    'Speisekarte der Neuen Liebe in Nebra (Unstrut) mit Vorspeisen, Hauptgerichten, Klassikern, Burgern, Steaks und Drinks.',
  keywords: 'Speisekarte Nebra, Restaurant Menü Nebra, Neue Liebe Speisekarte, Essen Nebra, Restaurant Nebra Gerichte',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/menu',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/menu',
      'en-US': 'https://www.neueliebe-nebra.de/en/menu',
      'x-default': 'https://www.neueliebe-nebra.de/menu',
    },
  },
  openGraph: {
    title: 'Speisekarte | Neue Liebe',
    description:
      'Entdecken Sie die Speisekarte der Neuen Liebe mit regionaler Küche, Klassikern, Burgern, Steaks und Drinks.',
    url: 'https://www.neueliebe-nebra.de/menu',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
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
      name: 'Speisekarte',
      item: 'https://www.neueliebe-nebra.de/menu',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('menu', 'de', 'https://www.neueliebe-nebra.de/menu')

export default async function MenuPage() {
  const { categories, dishes } = await getPublicMenuData()
  const menuStructuredData = buildMenuStructuredData('de', 'https://www.neueliebe-nebra.de/menu', categories, dishes)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <MenuPageClient categories={categories} dishes={dishes} />
    </>
  )
}
