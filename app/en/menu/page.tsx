import type { Metadata } from 'next'
import MenuPageClient from '../../menu/MenuPageClient'
import { getPublicMenuData } from '@/lib/menu-public'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'
import { buildMenuStructuredData } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Menu | Neue Liebe',
  description:
    'Neue Liebe menu in Nebra (Unstrut) with starters, main courses, classics, burgers, steaks and drinks.',
  keywords: 'Nebra restaurant menu, Neue Liebe menu, food in Nebra, steaks burgers Nebra, restaurant dishes Nebra',
  alternates: {
    canonical: 'https://neueliebe-nebra.de/en/menu',
    languages: {
      'de-DE': 'https://neueliebe-nebra.de/menu',
      'en-US': 'https://neueliebe-nebra.de/en/menu',
    },
  },
  openGraph: {
    title: 'Menu | Neue Liebe',
    description:
      'Explore the Neue Liebe menu with regional cuisine, classics, burgers, steaks and drinks.',
    url: 'https://neueliebe-nebra.de/en/menu',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
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
      name: 'Home',
      item: 'https://neueliebe-nebra.de/en',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Menu',
      item: 'https://neueliebe-nebra.de/en/menu',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('menu', 'en', 'https://neueliebe-nebra.de/en/menu')

export default async function EnglishMenuPage() {
  const { categories, dishes } = await getPublicMenuData()
  const menuStructuredData = buildMenuStructuredData('en', 'https://neueliebe-nebra.de/en/menu', categories, dishes)

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
      <MenuPageClient categories={categories} dishes={dishes} initialLang="en" />
    </>
  )
}
