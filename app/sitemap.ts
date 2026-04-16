import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: 'https://neueliebe-nebra.de/',
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://neueliebe-nebra.de/en',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://neueliebe-nebra.de/about',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://neueliebe-nebra.de/en/about',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://neueliebe-nebra.de/experience',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://neueliebe-nebra.de/en/experience',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://neueliebe-nebra.de/menu',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: 'https://neueliebe-nebra.de/en/menu',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: 'https://neueliebe-nebra.de/gallery',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://neueliebe-nebra.de/en/gallery',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://neueliebe-nebra.de/events',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://neueliebe-nebra.de/en/events',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://neueliebe-nebra.de/reviews',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: 'https://neueliebe-nebra.de/en/reviews',
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: 'https://neueliebe-nebra.de/contact',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: 'https://neueliebe-nebra.de/en/contact',
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
  ]
}
