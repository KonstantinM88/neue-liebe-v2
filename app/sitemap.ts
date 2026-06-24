import type { MetadataRoute } from 'next'
import { listNewsArticles } from '@/lib/news-store'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const [germanNews, englishNews] = await Promise.all([
    listNewsArticles('de'),
    listNewsArticles('en'),
  ])

  const staticEntries: MetadataRoute.Sitemap = [
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
      path: '/news',
      dePath: '/news',
      enPath: '/en/news',
      changeFrequency: 'weekly',
      priority: 0.8,
    }),
    buildSitemapEntry({
      path: '/en/news',
      dePath: '/news',
      enPath: '/en/news',
      changeFrequency: 'weekly',
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

  const germanBySlug = new Map(germanNews.map((article) => [article.slug, article]))
  const englishBySlug = new Map(englishNews.map((article) => [article.slug, article]))
  const newsSlugs = Array.from(new Set([...germanBySlug.keys(), ...englishBySlug.keys()]))
  const newsEntries: MetadataRoute.Sitemap = newsSlugs.flatMap((slug) => {
    const german = germanBySlug.get(slug)
    const english = englishBySlug.get(slug)

    if (!german || !english) return []

    const deUrl = `${siteUrl}/news/${slug}`
    const enUrl = `${siteUrl}/en/news/${slug}`
    const alternates = {
      languages: {
        'de-DE': deUrl,
        'en-US': enUrl,
        'x-default': deUrl,
      },
    }

    return [
      {
        url: deUrl,
        lastModified: new Date(german.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.72,
        alternates,
      },
      {
        url: enUrl,
        lastModified: new Date(english.updatedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates,
      },
    ]
  })

  return [...staticEntries, ...newsEntries]
}
