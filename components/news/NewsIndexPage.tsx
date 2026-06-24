import Image from 'next/image'
import Link from 'next/link'
import SitePageShell from '@/components/SitePageShell'
import type { NewsArticle, NewsLocale } from '@/lib/news-types'
import styles from './news.module.css'

const SITE_URL = 'https://www.neueliebe-nebra.de'

function formatDate(value: string, locale: NewsLocale): string {
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

function getArticleHref(locale: NewsLocale, slug: string): string {
  return locale === 'de' ? `/news/${slug}` : `/en/news/${slug}`
}

export default function NewsIndexPage({
  locale,
  articles,
}: {
  locale: NewsLocale
  articles: NewsArticle[]
}) {
  const isEnglish = locale === 'en'
  const pageUrl = isEnglish ? `${SITE_URL}/en/news` : `${SITE_URL}/news`
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: pageUrl,
    name: isEnglish ? 'News | Neue Liebe' : 'Nachrichten | Neue Liebe',
    description: isEnglish
      ? 'News, events and current updates from Restaurant Neue Liebe in Nebra (Unstrut).'
      : 'Nachrichten, Veranstaltungen und aktuelle Hinweise vom Restaurant Neue Liebe in Nebra (Unstrut).',
    inLanguage: isEnglish ? 'en-US' : 'de-DE',
    about: {
      '@type': 'Restaurant',
      name: 'Neue Liebe',
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Wetzendorfer Str. 10',
        postalCode: '06642',
        addressLocality: 'Nebra (Unstrut)',
        addressCountry: 'DE',
      },
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.map((article, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}${getArticleHref(locale, article.slug)}`,
        name: article.title,
      })),
    },
  }

  return (
    <SitePageShell initialLang={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className={styles.page}>
        <section className={styles.indexHero}>
          <p className={styles.kicker}>
            {isEnglish ? 'Current information' : 'Aktuelle Informationen'}
          </p>
          <h1 className={styles.indexTitle}>
            {isEnglish ? 'News from Neue Liebe' : 'Nachrichten aus der Neuen Liebe'}
          </h1>
          <p className={styles.indexLead}>
            {isEnglish
              ? 'Discover current events, culinary updates and important information from our restaurant in Nebra (Unstrut).'
              : 'Entdecken Sie aktuelle Veranstaltungen, kulinarische Nachrichten und wichtige Hinweise aus unserem Restaurant in Nebra (Unstrut).'}
          </p>
        </section>

        <section className={styles.indexContent} aria-label={isEnglish ? 'News articles' : 'Nachrichtenartikel'}>
          {articles.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>{isEnglish ? 'No news published yet' : 'Noch keine Nachrichten veröffentlicht'}</h2>
              <p>
                {isEnglish
                  ? 'New articles and announcements will appear here.'
                  : 'Neue Beiträge und Ankündigungen erscheinen künftig an dieser Stelle.'}
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {articles.map((article, index) => (
                <article key={article.slug} className={styles.card}>
                  <Link
                    href={getArticleHref(locale, article.slug)}
                    className={styles.cardImageLink}
                    aria-label={article.title}
                  >
                    <Image
                      src={article.coverImage}
                      alt={article.coverAlt}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      className={styles.cardImage}
                    />
                  </Link>

                  <div className={styles.cardBody}>
                    <div className={styles.cardMeta}>
                      <span>{article.category}</span>
                      <time dateTime={article.publishedAt}>
                        {formatDate(article.publishedAt, locale)}
                      </time>
                    </div>
                    <h2 className={styles.cardTitle}>
                      <Link href={getArticleHref(locale, article.slug)}>
                        {article.title}
                      </Link>
                    </h2>
                    <p className={styles.cardExcerpt}>{article.excerpt}</p>
                    <Link href={getArticleHref(locale, article.slug)} className={styles.readMore}>
                      {isEnglish ? 'Read article' : 'Artikel lesen'}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </SitePageShell>
  )
}
