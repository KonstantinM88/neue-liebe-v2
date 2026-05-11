import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const siteUrl = 'https://www.neueliebe-nebra.de'

  const buildSitemapEntry = ({
    path,
    dePath,
    enPath,
    changeFrequency,
    priority,
  }: {
    path: string
    dePath: string
    enPath: string
    changeFrequency: 'weekly' | 'monthly'
    priority: number
  }): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        'de-DE': `${siteUrl}${dePath}`,
        'en-US': `${siteUrl}${enPath}`,
        'x-default': `${siteUrl}${dePath}`,
      },
    },
  })

  return [
    buildSitemapEntry({
      path: '/',
      dePath: '/',
      enPath: '/en',
      changeFrequency: 'weekly',
      priority: 1,
    }),
    buildSitemapEntry({
      path: '/en',
      dePath: '/',
      enPath: '/en',
      changeFrequency: 'weekly',
      priority: 0.9,
    }),
    buildSitemapEntry({
      path: '/about',
      dePath: '/about',
      enPath: '/en/about',
      changeFrequency: 'monthly',
      priority: 0.8,
    }),
    buildSitemapEntry({
      path: '/en/about',
      dePath: '/about',
      enPath: '/en/about',
      changeFrequency: 'monthly',
      priority: 0.8,
    }),
    buildSitemapEntry({
      path: '/experience',
      dePath: '/experience',
      enPath: '/en/experience',
      changeFrequency: 'monthly',
      priority: 0.8,
    }),
    buildSitemapEntry({
      path: '/en/experience',
      dePath: '/experience',
      enPath: '/en/experience',
      changeFrequency: 'monthly',
      priority: 0.8,
    }),
    buildSitemapEntry({
      path: '/menu',
      dePath: '/menu',
      enPath: '/en/menu',
      changeFrequency: 'weekly',
      priority: 0.85,
    }),
    buildSitemapEntry({
      path: '/en/menu',
      dePath: '/menu',
      enPath: '/en/menu',
      changeFrequency: 'weekly',
      priority: 0.85,
    }),
    buildSitemapEntry({
      path: '/gallery',
      dePath: '/gallery',
      enPath: '/en/gallery',
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
    buildSitemapEntry({
      path: '/en/gallery',
      dePath: '/gallery',
      enPath: '/en/gallery',
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
    buildSitemapEntry({
      path: '/events',
      dePath: '/events',
      enPath: '/en/events',
      changeFrequency: 'monthly',
      priority: 0.8,
    }),
    buildSitemapEntry({
      path: '/en/events',
      dePath: '/events',
      enPath: '/en/events',
      changeFrequency: 'monthly',
      priority: 0.8,
    }),
    buildSitemapEntry({
      path: '/reviews',
      dePath: '/reviews',
      enPath: '/en/reviews',
      changeFrequency: 'weekly',
      priority: 0.75,
    }),
    buildSitemapEntry({
      path: '/en/reviews',
      dePath: '/reviews',
      enPath: '/en/reviews',
      changeFrequency: 'weekly',
      priority: 0.75,
    }),
    buildSitemapEntry({
      path: '/contact',
      dePath: '/contact',
      enPath: '/en/contact',
      changeFrequency: 'monthly',
      priority: 0.75,
    }),
    buildSitemapEntry({
      path: '/en/contact',
      dePath: '/contact',
      enPath: '/en/contact',
      changeFrequency: 'monthly',
      priority: 0.75,
    }),
  ]
}
