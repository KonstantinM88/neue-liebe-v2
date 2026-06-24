import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import NewsArticlePage from '@/components/news/NewsArticlePage'
import { readNewsArticle } from '@/lib/news-store'

export const dynamic = 'force-dynamic'

type EnglishNewsArticleRouteProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: EnglishNewsArticleRouteProps): Promise<Metadata> {
  const { slug } = await params
  const article = await readNewsArticle('en', slug)

  if (!article) {
    return { title: 'Article not found | Neue Liebe' }
  }

  const url = `https://www.neueliebe-nebra.de/en/news/${article.slug}`
  const germanUrl = `https://www.neueliebe-nebra.de/news/${article.slug}`

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    keywords: article.keywords,
    authors: [{ name: article.author }],
    alternates: {
      canonical: url,
      languages: {
        'de-DE': germanUrl,
        'en-US': url,
        'x-default': germanUrl,
      },
    },
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      url,
      locale: 'en_US',
      alternateLocale: ['de_DE'],
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

export default async function EnglishNewsArticleRoute({
  params,
}: EnglishNewsArticleRouteProps) {
  const { slug } = await params
  const article = await readNewsArticle('en', slug)

  if (!article) notFound()

  return <NewsArticlePage article={article} />
}
