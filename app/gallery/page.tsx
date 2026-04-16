import type { Metadata } from 'next'
import GalleryPageClient from './GalleryPageClient'
import { getPublicGalleryPhotos } from '@/lib/gallery-public'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'

export const metadata: Metadata = {
  title: 'Galerie | Neue Liebe',
  description: 'Galerie mit Eindrücken aus Restaurant, Küche, Terrasse und Events der Neuen Liebe.',
  alternates: {
    canonical: 'https://neueliebe-nebra.de/gallery',
    languages: {
      'de-DE': 'https://neueliebe-nebra.de/gallery',
      'en-US': 'https://neueliebe-nebra.de/en/gallery',
    },
  },
  openGraph: {
    title: 'Galerie | Neue Liebe',
    description: 'Bilder aus Restaurant, Terrasse, Küche und Events der Neuen Liebe in Nebra (Unstrut).',
    url: 'https://neueliebe-nebra.de/gallery',
    locale: 'de_DE',
    alternateLocale: ['en_US'],
    type: 'website',
  },
}

const galleryPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Galerie | Neue Liebe',
  description: 'Galerie mit Eindrücken aus Restaurant, Küche, Terrasse und Events der Neuen Liebe.',
  url: 'https://neueliebe-nebra.de/gallery',
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
      name: 'Galerie',
      item: 'https://neueliebe-nebra.de/gallery',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('gallery', 'de', 'https://neueliebe-nebra.de/gallery')

export default async function GalleryPage() {
  const photos = await getPublicGalleryPhotos('de')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryPageStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <GalleryPageClient photos={photos} />
    </>
  )
}
