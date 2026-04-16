import type { Metadata } from 'next'
import MenuPageClient from './MenuPageClient'
import { getPublicMenuData } from '@/lib/menu-public'

export const metadata: Metadata = {
  title: 'Speisekarte | Neue Liebe',
  description:
    'Speisekarte der Neuen Liebe in Nebra (Unstrut) mit Vorspeisen, Hauptgerichten, Klassikern, Burgern, Steaks und Drinks.',
  keywords: 'Speisekarte Nebra, Restaurant Menü Nebra, Neue Liebe Speisekarte, Essen Nebra, Restaurant Nebra Gerichte',
  alternates: {
    canonical: 'https://neueliebe-nebra.de/menu',
    languages: {
      'de-DE': 'https://neueliebe-nebra.de/menu',
      'en-US': 'https://neueliebe-nebra.de/en/menu',
    },
  },
  openGraph: {
    title: 'Speisekarte | Neue Liebe',
    description:
      'Entdecken Sie die Speisekarte der Neuen Liebe mit regionaler Küche, Klassikern, Burgern, Steaks und Drinks.',
    url: 'https://neueliebe-nebra.de/menu',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
  },
}

const menuPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Speisekarte | Neue Liebe',
  description:
    'Speisekarte der Neuen Liebe in Nebra (Unstrut) mit Vorspeisen, Hauptgerichten, Klassikern, Burgern, Steaks und Drinks.',
  url: 'https://neueliebe-nebra.de/menu',
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
      item: 'https://neueliebe-nebra.de/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Speisekarte',
      item: 'https://neueliebe-nebra.de/menu',
    },
  ],
}

export default async function MenuPage() {
  const { categories, dishes } = await getPublicMenuData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuPageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <MenuPageClient categories={categories} dishes={dishes} />
    </>
  )
}
