import type { Metadata } from 'next'
import GalleryPageClient from '../../gallery/GalleryPageClient'
import { getPublicGalleryPhotos } from '@/lib/gallery-public'
import { buildFaqPageStructuredData } from '@/lib/page-faqs'
import { buildGalleryStructuredData } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Gallery | Neue Liebe',
  description: 'Gallery with impressions from the restaurant, cuisine, terrace and events at Neue Liebe.',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/en/gallery',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/gallery',
      'en-US': 'https://www.neueliebe-nebra.de/en/gallery',
      'x-default': 'https://www.neueliebe-nebra.de/gallery',
    },
  },
  openGraph: {
    title: 'Gallery | Neue Liebe',
    description: 'Images from the restaurant, terrace, cuisine and events at Neue Liebe in Nebra (Unstrut).',
    url: 'https://www.neueliebe-nebra.de/en/gallery',
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
      item: 'https://www.neueliebe-nebra.de/en',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Gallery',
      item: 'https://www.neueliebe-nebra.de/en/gallery',
    },
  ],
}

const faqStructuredData = buildFaqPageStructuredData('gallery', 'en', 'https://www.neueliebe-nebra.de/en/gallery')

export default async function EnglishGalleryPage() {
  const photos = await getPublicGalleryPhotos('en')
  const galleryPageStructuredData = buildGalleryStructuredData(
    'en',
    'https://www.neueliebe-nebra.de/en/gallery',
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
      <GalleryPageClient photos={photos} initialLang="en" />
    </>
  )
}
