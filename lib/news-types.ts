import type { SiteLocale } from '@/lib/site-locale'

export type NewsLocale = SiteLocale

export type NewsArticle = {
  slug: string
  locale: NewsLocale
  title: string
  excerpt: string
  body: string
  seoTitle: string
  seoDescription: string
  keywords: string[]
  keyFacts: string[]
  category: string
  author: string
  publishedAt: string
  updatedAt: string
  coverImage: string
  coverImageMobile: string
  coverAlt: string
  draft: boolean
}

export type AdminNewsEntry = {
  slug: string
  de: NewsArticle | null
  en: NewsArticle | null
}

export type SaveNewsInput = {
  slug: string
  originalSlug?: string
  author: string
  publishedAt: string
  draft: boolean
  coverImage: string
  coverImageMobile: string
  de: Omit<
    NewsArticle,
    | 'slug'
    | 'locale'
    | 'author'
    | 'publishedAt'
    | 'updatedAt'
    | 'draft'
    | 'coverImage'
    | 'coverImageMobile'
  >
  en: Omit<
    NewsArticle,
    | 'slug'
    | 'locale'
    | 'author'
    | 'publishedAt'
    | 'updatedAt'
    | 'draft'
    | 'coverImage'
    | 'coverImageMobile'
  >
}
