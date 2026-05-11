import type { Metadata } from 'next'
import GalleryPageClient from './GalleryPageClient'
import { getPublicGalleryPhotos } from '@/lib/gallery-public'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'
import { buildGalleryStructuredData } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Galerie | Neue Liebe',
  description: 'Galerie mit Eindrücken aus Restaurant, Küche, Terrasse und Events der Neuen Liebe.',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/gallery',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/gallery',
      'en-US': 'https://www.neueliebe-nebra.de/en/gallery',
      'x-default': 'https://www.neueliebe-nebra.de/gallery',
    },
  },
  openGraph: {
    title: 'Galerie | Neue Liebe',
    description: 'Bilder aus Restaurant, Terrasse, Küche und Events der Neuen Liebe in Nebra (Unstrut).',
    url: 'https://www.neueliebe-nebra.de/gallery',
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
      name: 'Galerie',
      item: 'https://www.neueliebe-nebra.de/gallery',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('gallery', 'de', 'https://www.neueliebe-nebra.de/gallery')

export default async function GalleryPage() {
  const photos = await getPublicGalleryPhotos('de')
  const galleryPageStructuredData = buildGalleryStructuredData(
    'de',
    'https://www.neueliebe-nebra.de/gallery',
    photos
  )

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
