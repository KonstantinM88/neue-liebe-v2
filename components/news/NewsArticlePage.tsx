import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SitePageShell from '@/components/SitePageShell'
import { buildNewsArticleStructuredData } from '@/lib/news-structured-data'
import type { NewsArticle } from '@/lib/news-types'
import styles from './news.module.css'

function formatDate(value: string, locale: NewsArticle['locale']): string {
  return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

export default function NewsArticlePage({ article }: { article: NewsArticle }) {
  const isEnglish = article.locale === 'en'
  const structuredData = buildNewsArticleStructuredData(article)
  const newsHref = isEnglish ? '/en/news' : '/news'
  const reservationHref = isEnglish ? '/en#reservation' : '/#reservation'

  return (
    <SitePageShell initialLang={article.locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className={styles.page}>
        <article
          className={styles.article}
          itemScope
          itemType="https://schema.org/NewsArticle"
        >
          <header className={styles.articleHeader}>
            <Link href={newsHref} className={styles.backLink}>
              ← {isEnglish ? 'All news' : 'Alle Nachrichten'}
            </Link>

            <div className={styles.articleMeta}>
              <span itemProp="articleSection">{article.category}</span>
              <time itemProp="datePublished" dateTime={article.publishedAt}>
                {formatDate(article.publishedAt, article.locale)}
              </time>
            </div>

            <h1
              className={`${styles.articleTitle} news-article-title`}
              itemProp="headline"
            >
              {article.title}
            </h1>
            <p
              className={`${styles.articleExcerpt} news-article-excerpt`}
              itemProp="description"
            >
              {article.excerpt}
            </p>

            <div className={styles.byline}>
              {isEnglish ? 'Published by' : 'Veröffentlicht von'}{' '}
              <span itemProp="author">{article.author}</span>
            </div>
          </header>

          <div className={styles.cover}>
            <Image
              src={article.coverImage}
              alt={article.coverAlt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 1100px"
              className={styles.coverImage}
              itemProp="image"
            />
          </div>

          {article.keyFacts.length > 0 && (
            <aside className={`${styles.keyFacts} news-key-facts`}>
              <p className={styles.keyFactsKicker}>
                {isEnglish ? 'At a glance' : 'Kurz erklärt'}
              </p>
              <h2>{isEnglish ? 'Key facts' : 'Die wichtigsten Fakten'}</h2>
              <ul>
                {article.keyFacts.map((fact) => (
                  <li key={fact}>{fact}</li>
                ))}
              </ul>
            </aside>
          )}

          <div className={styles.articleLayout}>
            <div className={styles.markdown} itemProp="articleBody">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {article.body}
              </ReactMarkdown>
            </div>

            <aside className={styles.articleAside}>
              <div className={styles.asideCard}>
                <p>{isEnglish ? 'Restaurant Neue Liebe' : 'Restaurant Neue Liebe'}</p>
                <strong>Wetzendorfer Str. 10</strong>
                <span>06642 Nebra (Unstrut)</span>
                <a href="tel:+4934461599804">+49 34461 599804</a>
              </div>
              <Link href={reservationHref} className={styles.reserveLink}>
                {isEnglish ? 'Request a table' : 'Tisch anfragen'}
              </Link>
            </aside>
          </div>
        </article>
      </main>
    </SitePageShell>
  )
}
