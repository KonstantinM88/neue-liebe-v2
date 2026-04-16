import type { Metadata } from 'next'
import GalleryPageClient from '../../gallery/GalleryPageClient'
import { getPublicGalleryPhotos } from '@/lib/gallery-public'

export const metadata: Metadata = {
  title: 'Gallery | Neue Liebe',
  description: 'Gallery with impressions from the restaurant, cuisine, terrace and events at Neue Liebe.',
  alternates: {
    canonical: 'https://neueliebe-nebra.de/en/gallery',
    languages: {
      'de-DE': 'https://neueliebe-nebra.de/gallery',
      'en-US': 'https://neueliebe-nebra.de/en/gallery',
    },
  },
  openGraph: {
    title: 'Gallery | Neue Liebe',
    description: 'Images from the restaurant, terrace, cuisine and events at Neue Liebe in Nebra (Unstrut).',
    url: 'https://neueliebe-nebra.de/en/gallery',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    type: 'website',
  },
}

const galleryPageStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Gallery | Neue Liebe',
  description: 'Gallery with impressions from the restaurant, cuisine, terrace and events at Neue Liebe.',
  url: 'https://neueliebe-nebra.de/en/gallery',
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
      item: 'https://neueliebe-nebra.de/en',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Gallery',
      item: 'https://neueliebe-nebra.de/en/gallery',
    },
  ],
}

export default async function EnglishGalleryPage() {
  const photos = await getPublicGalleryPhotos('en')

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
      <GalleryPageClient photos={photos} initialLang="en" />
    </>
  )
}
