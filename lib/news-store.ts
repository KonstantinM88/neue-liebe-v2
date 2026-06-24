import 'server-only'

import path from 'node:path'
import { mkdir } from 'node:fs/promises'
import { NewsLocale as PrismaNewsLocale } from '@/generated/prisma/enums'
import type {
  NewsPost as PrismaNewsPost,
  NewsTranslation as PrismaNewsTranslation,
} from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import type {
  AdminNewsEntry,
  NewsArticle,
  NewsLocale,
  SaveNewsInput,
} from '@/lib/news-types'

export const NEWS_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'news')

type NewsPostWithTranslations = PrismaNewsPost & {
  translations: PrismaNewsTranslation[]
}

function toPrismaLocale(locale: NewsLocale): PrismaNewsLocale {
  return locale === 'de' ? PrismaNewsLocale.DE : PrismaNewsLocale.EN
}

function toSiteLocale(locale: PrismaNewsLocale): NewsLocale {
  return locale === PrismaNewsLocale.DE ? 'de' : 'en'
}

export function slugifyNewsSlug(value: string): string {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function isValidNewsSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

export async function ensureNewsStorage(): Promise<void> {
  await mkdir(NEWS_UPLOAD_DIR, { recursive: true })
}

function mapNewsArticle(
  post: PrismaNewsPost,
  translation: PrismaNewsTranslation
): NewsArticle {
  return {
    slug: post.slug,
    locale: toSiteLocale(translation.locale),
    title: translation.title,
    excerpt: translation.excerpt,
    body: translation.body,
    seoTitle: translation.seoTitle,
    seoDescription: translation.seoDescription,
    keywords: translation.keywords,
    keyFacts: translation.keyFacts,
    category: translation.category,
    author: post.author,
    publishedAt: post.publishedAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    coverImage: post.coverImage,
    coverImageMobile: post.coverImageMobile,
    coverAlt: translation.coverAlt,
    draft: post.draft,
  }
}

function mapAdminEntry(post: NewsPostWithTranslations): AdminNewsEntry {
  const de = post.translations.find(
    (translation) => translation.locale === PrismaNewsLocale.DE
  )
  const en = post.translations.find(
    (translation) => translation.locale === PrismaNewsLocale.EN
  )

  return {
    slug: post.slug,
    de: de ? mapNewsArticle(post, de) : null,
    en: en ? mapNewsArticle(post, en) : null,
  }
}

export async function readNewsArticle(
  locale: NewsLocale,
  slug: string,
  options: { includeDrafts?: boolean } = {}
): Promise<NewsArticle | null> {
  if (!isValidNewsSlug(slug)) return null

  const post = await prisma.newsPost.findFirst({
    where: {
      slug,
      ...(options.includeDrafts ? {} : { draft: false }),
    },
    include: {
      translations: {
        where: { locale: toPrismaLocale(locale) },
        take: 1,
      },
    },
  })

  const translation = post?.translations[0]
  return post && translation ? mapNewsArticle(post, translation) : null
}

export async function listNewsArticles(
  locale: NewsLocale,
  options: { includeDrafts?: boolean } = {}
): Promise<NewsArticle[]> {
  const posts = await prisma.newsPost.findMany({
    where: options.includeDrafts ? {} : { draft: false },
    orderBy: { publishedAt: 'desc' },
    include: {
      translations: {
        where: { locale: toPrismaLocale(locale) },
        take: 1,
      },
    },
  })

  return posts.flatMap((post) => {
    const translation = post.translations[0]
    return translation ? [mapNewsArticle(post, translation)] : []
  })
}

export async function listAdminNewsEntries(): Promise<AdminNewsEntry[]> {
  const posts = await prisma.newsPost.findMany({
    orderBy: { publishedAt: 'desc' },
    include: {
      translations: {
        orderBy: { locale: 'asc' },
      },
    },
  })

  return posts.map(mapAdminEntry)
}

function translationData(input: SaveNewsInput, locale: NewsLocale) {
  const localized = input[locale]

  return {
    title: localized.title,
    excerpt: localized.excerpt,
    body: localized.body,
    seoTitle: localized.seoTitle,
    seoDescription: localized.seoDescription,
    keywords: localized.keywords,
    keyFacts: localized.keyFacts,
    category: localized.category,
    coverAlt: localized.coverAlt,
  }
}

export async function saveNewsArticles(input: SaveNewsInput): Promise<AdminNewsEntry> {
  if (!isValidNewsSlug(input.slug)) {
    throw new Error('Invalid news slug')
  }

  const saved = await prisma.$transaction(async (tx) => {
    const existing = input.originalSlug
      ? await tx.newsPost.findUnique({ where: { slug: input.originalSlug } })
      : null

    if (!existing) {
      return tx.newsPost.create({
        data: {
          slug: input.slug,
          author: input.author,
          publishedAt: new Date(input.publishedAt),
          draft: input.draft,
          coverImage: input.coverImage,
          coverImageMobile: input.coverImageMobile,
          translations: {
            create: [
              {
                locale: PrismaNewsLocale.DE,
                ...translationData(input, 'de'),
              },
              {
                locale: PrismaNewsLocale.EN,
                ...translationData(input, 'en'),
              },
            ],
          },
        },
        include: { translations: true },
      })
    }

    return tx.newsPost.update({
      where: { id: existing.id },
      data: {
        slug: input.slug,
        author: input.author,
        publishedAt: new Date(input.publishedAt),
        draft: input.draft,
        coverImage: input.coverImage,
        coverImageMobile: input.coverImageMobile,
        translations: {
          upsert: [
            {
              where: {
                postId_locale: {
                  postId: existing.id,
                  locale: PrismaNewsLocale.DE,
                },
              },
              create: {
                locale: PrismaNewsLocale.DE,
                ...translationData(input, 'de'),
              },
              update: translationData(input, 'de'),
            },
            {
              where: {
                postId_locale: {
                  postId: existing.id,
                  locale: PrismaNewsLocale.EN,
                },
              },
              create: {
                locale: PrismaNewsLocale.EN,
                ...translationData(input, 'en'),
              },
              update: translationData(input, 'en'),
            },
          ],
        },
      },
      include: { translations: true },
    })
  })

  return mapAdminEntry(saved)
}

export async function deleteNewsArticles(slug: string): Promise<void> {
  if (!isValidNewsSlug(slug)) return
  await prisma.newsPost.deleteMany({ where: { slug } })
}
