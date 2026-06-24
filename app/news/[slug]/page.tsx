import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NewsArticlePage from '@/components/news/NewsArticlePage'
import { readNewsArticle } from '@/lib/news-store'

export const dynamic = 'force-dynamic'

type NewsArticleRouteProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: NewsArticleRouteProps): Promise<Metadata> {
  const { slug } = await params
  const article = await readNewsArticle('de', slug)

  if (!article) {
    return { title: 'Artikel nicht gefunden | Neue Liebe' }
  }

  const url = `https://www.neueliebe-nebra.de/news/${article.slug}`
  const englishUrl = `https://www.neueliebe-nebra.de/en/news/${article.slug}`

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    keywords: article.keywords,
    authors: [{ name: article.author }],
    alternates: {
      canonical: url,
      languages: {
        'de-DE': url,
        'en-US': englishUrl,
        'x-default': url,
      },
    },
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      url,
      locale: 'de_DE',
      alternateLocale: ['en_US'],
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      tags: article.keywords,
      images: [{ url: article.coverImage, alt: article.coverAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle,
      description: article.seoDescription,
      images: [article.coverImage],
    },
    other: {
      'geo.region': 'DE-ST',
      'geo.placename': 'Nebra (Unstrut)',
    },
  }
}

export default async function NewsArticleRoute({ params }: NewsArticleRouteProps) {
  const { slug } = await params
  const article = await readNewsArticle('de', slug)

  if (!article) notFound()

  return <NewsArticlePage article={article} />
}
