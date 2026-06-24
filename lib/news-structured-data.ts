import type { NewsArticle } from '@/lib/news-types'

const SITE_URL = 'https://www.neueliebe-nebra.de'
const RESTAURANT_ID = `${SITE_URL}#restaurant`

function absoluteUrl(value: string): string {
  return value.startsWith('http://') || value.startsWith('https://')
    ? value
    : `${SITE_URL}${value}`
}

export function getNewsArticleUrl(article: NewsArticle): string {
  return article.locale === 'de'
    ? `${SITE_URL}/news/${article.slug}`
    : `${SITE_URL}/en/news/${article.slug}`
}

export function buildNewsArticleStructuredData(article: NewsArticle) {
  const url = getNewsArticleUrl(article)
  const isEnglish = article.locale === 'en'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Restaurant',
        '@id': RESTAURANT_ID,
        name: 'Neue Liebe',
        url: SITE_URL,
        telephone: '+49 34461 599804',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Wetzendorfer Str. 10',
          postalCode: '06642',
          addressLocality: 'Nebra (Unstrut)',
          addressRegion: 'Sachsen-Anhalt',
          addressCountry: 'DE',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: article.seoTitle,
        description: article.seoDescription,
        inLanguage: isEnglish ? 'en-US' : 'de-DE',
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        mainEntity: { '@id': `${url}#article` },
        about: { '@id': RESTAURANT_ID },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.news-article-title', '.news-article-excerpt', '.news-key-facts'],
        },
      },
      {
        '@type': 'NewsArticle',
        '@id': `${url}#article`,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        headline: article.title,
        description: article.excerpt,
        articleSection: article.category,
        keywords: article.keywords.join(', '),
        inLanguage: isEnglish ? 'en-US' : 'de-DE',
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        image: [
          absoluteUrl(article.coverImage),
          absoluteUrl(article.coverImageMobile),
        ],
        author: {
          '@type': 'Organization',
          name: article.author,
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Restaurant',
          '@id': RESTAURANT_ID,
          name: 'Neue Liebe',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/icon.png`,
          },
        },
        about: {
          '@type': 'Restaurant',
          '@id': RESTAURANT_ID,
        },
        contentLocation: {
          '@type': 'Place',
          name: 'Neue Liebe, Nebra (Unstrut)',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Wetzendorfer Str. 10',
            postalCode: '06642',
            addressLocality: 'Nebra (Unstrut)',
            addressRegion: 'Sachsen-Anhalt',
            addressCountry: 'DE',
          },
        },
        isAccessibleForFree: true,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isEnglish ? 'Home' : 'Startseite',
            item: isEnglish ? `${SITE_URL}/en` : `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isEnglish ? 'News' : 'Nachrichten',
            item: isEnglish ? `${SITE_URL}/en/news` : `${SITE_URL}/news`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: url,
          },
        ],
      },
    ],
  }
}
