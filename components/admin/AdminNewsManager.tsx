'use client'

import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminLang } from '@/lib/admin-lang'
import type { AdminNewsEntry, NewsArticle } from '@/lib/news-types'
import styles from './admin-gallery-manager.module.css'

type LocalizedForm = {
  title: string
  excerpt: string
  body: string
  seoTitle: string
  seoDescription: string
  keywords: string
  keyFacts: string
  category: string
  coverAlt: string
}

type ApiResponse = {
  entries?: AdminNewsEntry[]
  storageConfigured?: boolean
  storageDriver?: 'local' | 's3'
  success?: boolean
  error?: string
}

const navItems = [
  { href: '/admin/gallery', titleDe: 'Galerie', titleRu: 'Галерея', subtitleDe: 'Fotos und Konvertierung', subtitleRu: 'Фото и конвертация' },
  { href: '/admin/menu', titleDe: 'Menü', titleRu: 'Меню', subtitleDe: 'Kategorien und Gerichte', subtitleRu: 'Категории и блюда' },
  { href: '/admin/news', active: true, titleDe: 'Nachrichten', titleRu: 'Новости', subtitleDe: 'Markdown und SEO', subtitleRu: 'Markdown и SEO' },
  { href: '/', titleDe: 'Website', titleRu: 'Сайт', subtitleDe: 'Startseite öffnen', subtitleRu: 'Открыть главную' },
]

function emptyLocalizedForm(locale: 'de' | 'en'): LocalizedForm {
  return {
    title: '',
    excerpt: '',
    body: '',
    seoTitle: '',
    seoDescription: '',
    keywords: '',
    keyFacts: '',
    category: locale === 'de' ? 'Nachrichten' : 'News',
    coverAlt: '',
  }
}

function articleToForm(article: NewsArticle | null, locale: 'de' | 'en'): LocalizedForm {
  if (!article) return emptyLocalizedForm(locale)

  return {
    title: article.title,
    excerpt: article.excerpt,
    body: article.body,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    keywords: article.keywords.join('\n'),
    keyFacts: article.keyFacts.join('\n'),
    category: article.category,
    coverAlt: article.coverAlt,
  }
}

function LocalizedEditor({
  locale,
  value,
  onChange,
  t,
}: {
  locale: 'de' | 'en'
  value: LocalizedForm
  onChange: (key: keyof LocalizedForm, value: string) => void
  t: (de: string, ru: string) => string
}) {
  return (
    <section className={styles.newsLocalePanel}>
      <h3 className={styles.newsLocaleTitle}>{locale.toUpperCase()}</h3>

      <label className={styles.label} htmlFor={`news-title-${locale}`}>
        {t('Titel', 'Заголовок')}
      </label>
      <input
        id={`news-title-${locale}`}
        className={styles.field}
        value={value.title}
        onChange={(event) => onChange('title', event.target.value)}
        maxLength={140}
        required
      />

      <label className={styles.label} htmlFor={`news-excerpt-${locale}`}>
        {t('Kurzbeschreibung', 'Краткое описание')}
      </label>
      <textarea
        id={`news-excerpt-${locale}`}
        className={`${styles.field} ${styles.newsTextarea}`}
        value={value.excerpt}
        onChange={(event) => onChange('excerpt', event.target.value)}
        maxLength={320}
        required
      />

      <label className={styles.label} htmlFor={`news-category-${locale}`}>
        {t('Kategorie', 'Категория')}
      </label>
      <input
        id={`news-category-${locale}`}
        className={styles.field}
        value={value.category}
        onChange={(event) => onChange('category', event.target.value)}
        maxLength={60}
      />

      <label className={styles.label} htmlFor={`news-body-${locale}`}>
        {t('Artikel in Markdown', 'Статья в Markdown')}
      </label>
      <textarea
        id={`news-body-${locale}`}
        className={`${styles.field} ${styles.newsTextarea} ${styles.newsBody}`}
        value={value.body}
        onChange={(event) => onChange('body', event.target.value)}
        placeholder={'## Überschrift\n\nText mit **Fettdruck**, Listen und Links.'}
        required
      />

      <details className={styles.newsPreview}>
        <summary>{t('Markdown-Vorschau', 'Предпросмотр Markdown')}</summary>
        <div className={styles.newsPreviewContent}>
          {value.body ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value.body}</ReactMarkdown>
          ) : (
            <p>{t('Noch kein Inhalt.', 'Содержимое пока отсутствует.')}</p>
          )}
        </div>
      </details>

      <label className={styles.label} htmlFor={`news-facts-${locale}`}>
        {t('GEO / AI-Schlüsselfakten (eine Zeile pro Fakt)', 'GEO / AI-факты (один факт на строку)')}
      </label>
      <textarea
        id={`news-facts-${locale}`}
        className={`${styles.field} ${styles.newsTextarea}`}
        value={value.keyFacts}
        onChange={(event) => onChange('keyFacts', event.target.value)}
      />

      <label className={styles.label} htmlFor={`news-seo-title-${locale}`}>
        {t('SEO-Titel (max. 70 Zeichen)', 'SEO-заголовок (до 70 символов)')}
      </label>
      <input
        id={`news-seo-title-${locale}`}
        className={styles.field}
        value={value.seoTitle}
        onChange={(event) => onChange('seoTitle', event.target.value)}
        maxLength={70}
      />

      <label className={styles.label} htmlFor={`news-seo-description-${locale}`}>
        {t('SEO-Beschreibung (max. 170 Zeichen)', 'SEO-описание (до 170 символов)')}
      </label>
      <textarea
        id={`news-seo-description-${locale}`}
        className={`${styles.field} ${styles.newsTextarea}`}
        value={value.seoDescription}
        onChange={(event) => onChange('seoDescription', event.target.value)}
        maxLength={170}
      />

      <label className={styles.label} htmlFor={`news-keywords-${locale}`}>
        {t('Keywords (eine Zeile oder Komma)', 'Ключевые слова (строки или запятые)')}
      </label>
      <textarea
        id={`news-keywords-${locale}`}
        className={`${styles.field} ${styles.newsTextarea}`}
        value={value.keywords}
        onChange={(event) => onChange('keywords', event.target.value)}
      />

      <label className={styles.label} htmlFor={`news-cover-alt-${locale}`}>
        {t('ALT-Text der Titelgrafik', 'ALT-текст обложки')}
      </label>
      <input
        id={`news-cover-alt-${locale}`}
        className={styles.field}
        value={value.coverAlt}
        onChange={(event) => onChange('coverAlt', event.target.value)}
        maxLength={160}
      />
    </section>
  )
}

export default function AdminNewsManager() {
  const router = useRouter()
  const { lang, setLang, t } = useAdminLang()
  const coverInputRef = useRef<HTMLInputElement | null>(null)
  const [entries, setEntries] = useState<AdminNewsEntry[]>([])
  const [storageConfigured, setStorageConfigured] = useState(false)
  const [storageDriver, setStorageDriver] = useState<'local' | 's3'>('local')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [originalSlug, setOriginalSlug] = useState('')
  const [slug, setSlug] = useState('')
  const [author, setAuthor] = useState('Neue Liebe')
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().slice(0, 10))
  const [draft, setDraft] = useState(true)
  const [cover, setCover] = useState<File | null>(null)
  const [de, setDe] = useState<LocalizedForm>(() => emptyLocalizedForm('de'))
  const [en, setEn] = useState<LocalizedForm>(() => emptyLocalizedForm('en'))
  const isEditing = Boolean(originalSlug)

  const loadEntries = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/news', { cache: 'no-store' })
      const payload = (await response.json().catch(() => ({}))) as ApiResponse

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }
      if (!response.ok) {
        setError(payload.error ?? t('Nachrichten konnten nicht geladen werden.', 'Не удалось загрузить новости.'))
        return
      }

      setEntries(payload.entries ?? [])
      setStorageConfigured(payload.storageConfigured ?? false)
      setStorageDriver(payload.storageDriver ?? 'local')
    } catch (loadError) {
      console.error('[Admin news load]', loadError)
      setError(t('Fehler beim Laden der Nachrichten.', 'Ошибка загрузки новостей.'))
    } finally {
      setLoading(false)
    }
  }, [router, t])

  useEffect(() => {
    void loadEntries()
  }, [loadEntries])

  function updateLocalized(locale: 'de' | 'en', key: keyof LocalizedForm, value: string) {
    const setter = locale === 'de' ? setDe : setEn
    setter((current) => ({ ...current, [key]: value }))
  }

  function resetForm() {
    setOriginalSlug('')
    setSlug('')
    setAuthor('Neue Liebe')
    setPublishedAt(new Date().toISOString().slice(0, 10))
    setDraft(true)
    setCover(null)
    setDe(emptyLocalizedForm('de'))
    setEn(emptyLocalizedForm('en'))
    if (coverInputRef.current) coverInputRef.current.value = ''
  }

  function beginEdit(entry: AdminNewsEntry) {
    const base = entry.de ?? entry.en
    setOriginalSlug(entry.slug)
    setSlug(entry.slug)
    setAuthor(base?.author ?? 'Neue Liebe')
    setPublishedAt((base?.publishedAt ?? new Date().toISOString()).slice(0, 10))
    setDraft(base?.draft ?? true)
    setCover(null)
    setDe(articleToForm(entry.de, 'de'))
    setEn(articleToForm(entry.en, 'en'))
    if (coverInputRef.current) coverInputRef.current.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const formData = new FormData()
      formData.append('action', 'save')
      formData.append('originalSlug', originalSlug)
      formData.append('slug', slug)
      formData.append('author', author)
      formData.append('publishedAt', publishedAt)
      formData.append('draft', String(draft))
      if (cover) formData.append('cover', cover)

      for (const [suffix, values] of [['De', de], ['En', en]] as const) {
        for (const [key, value] of Object.entries(values)) {
          formData.append(`${key}${suffix}`, value)
        }
      }

      const response = await fetch('/api/admin/news', { method: 'POST', body: formData })
      const payload = (await response.json().catch(() => ({}))) as ApiResponse

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }
      if (!response.ok) {
        setError(payload.error ?? t('Nachricht konnte nicht gespeichert werden.', 'Не удалось сохранить новость.'))
        return
      }

      setMessage(isEditing ? t('Nachricht aktualisiert.', 'Новость обновлена.') : t('Nachricht erstellt.', 'Новость создана.'))
      resetForm()
      await loadEntries()
    } catch (submitError) {
      console.error('[Admin news save]', submitError)
      setError(t('Fehler beim Speichern.', 'Ошибка сохранения.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(entry: AdminNewsEntry) {
    const title = entry.de?.title ?? entry.en?.title ?? entry.slug
    if (!window.confirm(t(`"${title}" wirklich löschen?`, `Удалить "${title}"?`))) return

    setDeleting(entry.slug)
    setMessage('')
    setError('')

    try {
      const formData = new FormData()
      formData.append('action', 'delete')
      formData.append('slug', entry.slug)
      const response = await fetch('/api/admin/news', { method: 'POST', body: formData })
      const payload = (await response.json().catch(() => ({}))) as ApiResponse

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }
      if (!response.ok) {
        setError(payload.error ?? t('Nachricht konnte nicht gelöscht werden.', 'Не удалось удалить новость.'))
        return
      }

      if (originalSlug === entry.slug) resetForm()
      setMessage(t('Nachricht gelöscht.', 'Новость удалена.'))
      await loadEntries()
    } catch (deleteError) {
      console.error('[Admin news delete]', deleteError)
      setError(t('Fehler beim Löschen.', 'Ошибка удаления.'))
    } finally {
      setDeleting('')
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          Neue Liebe
          <span>{t('Admin-Bereich', 'Админ-панель')}</span>
        </div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem}${item.active ? ` ${styles.navItemActive}` : ''}`}
            >
              <span className={styles.navTitle}>{t(item.titleDe, item.titleRu)}</span>
              <span className={styles.navSubtitle}>{t(item.subtitleDe, item.subtitleRu)}</span>
            </Link>
          ))}
        </nav>

        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          {t('Admin verlassen', 'Выйти из админки')}
        </button>
      </aside>

      <main className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.kicker}>{t('Admin / Nachrichten', 'Админ / Новости')}</p>
            <h1 className={styles.title}>{t('Markdown-Nachrichteneditor', 'Markdown-редактор новостей')}</h1>
            <p className={styles.subtitle}>
              {t(
                'Erstellen Sie zweisprachige Artikel mit SEO-Metadaten, GEO-Fakten und NewsArticle-Markup.',
                'Создавайте двуязычные статьи с SEO-метаданными, GEO-фактами и разметкой NewsArticle.'
              )}
            </p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.langSwitch}>
              <button type="button" className={`${styles.langBtn}${lang === 'de' ? ` ${styles.langBtnActive}` : ''}`} onClick={() => setLang('de')}>DE</button>
              <button type="button" className={`${styles.langBtn}${lang === 'ru' ? ` ${styles.langBtnActive}` : ''}`} onClick={() => setLang('ru')}>RU</button>
            </div>
            <button type="button" className={styles.ghostAction} onClick={loadEntries}>
              {t('Aktualisieren', 'Обновить')}
            </button>
          </div>
        </header>

        <form className={styles.newsForm} onSubmit={handleSave}>
          {!storageConfigured && (
            <div className={`${styles.alert} ${styles.alertError}`}>
              {t(
                'Object Storage ist nicht konfiguriert. Nachrichten können ohne neue Titelgrafik gespeichert werden.',
                'Object Storage не настроен. Новости можно сохранять без новой обложки.'
              )}
            </div>
          )}
          {storageConfigured && storageDriver === 'local' && (
            <div className={`${styles.alert} ${styles.alertOk}`}>
              {t(
                'Lokaler Bildspeicher ist aktiv: public/uploads/news.',
                'Активно локальное хранение изображений: public/uploads/news.'
              )}
            </div>
          )}

          <section className={styles.queueSection}>
            <div className={styles.queueHead}>
              <h3>{isEditing ? t('Nachricht bearbeiten', 'Редактирование новости') : t('Neue Nachricht erstellen', 'Создание новости')}</h3>
            </div>

            <div className={styles.newsMetaGrid}>
              <div>
                <label className={styles.label} htmlFor="news-slug">Slug</label>
                <input id="news-slug" className={styles.field} value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="sommerfest-2026" required />
              </div>
              <div>
                <label className={styles.label} htmlFor="news-date">{t('Veröffentlichungsdatum', 'Дата публикации')}</label>
                <input id="news-date" className={styles.field} type="date" value={publishedAt} onChange={(event) => setPublishedAt(event.target.value)} required />
              </div>
              <div>
                <label className={styles.label} htmlFor="news-author">{t('Autor / Organisation', 'Автор / организация')}</label>
                <input id="news-author" className={styles.field} value={author} onChange={(event) => setAuthor(event.target.value)} required />
              </div>
              <div className={styles.newsCoverField}>
                <span className={styles.label}>{t('Titelgrafik', 'Обложка')}</span>
                <button
                  type="button"
                  className={styles.pickBtn}
                  onClick={() => coverInputRef.current?.click()}
                  disabled={!storageConfigured}
                >
                  {cover ? cover.name : t('Bild auswählen (optional)', 'Выбрать изображение (optional)')}
                </button>
                <input ref={coverInputRef} type="file" accept="image/*" className={styles.fileInput} onChange={(event: ChangeEvent<HTMLInputElement>) => setCover(event.target.files?.[0] ?? null)} />
              </div>
            </div>

            <label className={styles.newsCheckbox}>
              <input type="checkbox" checked={draft} onChange={(event) => setDraft(event.target.checked)} />
              <span>{t('Als Entwurf speichern (nicht öffentlich)', 'Сохранить как черновик (не публиковать)')}</span>
            </label>
          </section>

          <div className={styles.newsColumns}>
            <LocalizedEditor locale="de" value={de} onChange={(key, value) => updateLocalized('de', key, value)} t={t} />
            <LocalizedEditor locale="en" value={en} onChange={(key, value) => updateLocalized('en', key, value)} t={t} />
          </div>

          <div className={styles.newsActions}>
            <button type="submit" className={styles.primaryAction} disabled={saving}>
              {saving ? t('Speichern...', 'Сохранение...') : isEditing ? t('Nachricht aktualisieren', 'Обновить новость') : t('Nachricht erstellen', 'Создать новость')}
            </button>
            {isEditing && <button type="button" className={styles.ghostAction} onClick={resetForm}>{t('Bearbeitung abbrechen', 'Отменить редактирование')}</button>}
          </div>
        </form>

        {(message || error) && <div className={`${styles.alert}${error ? ` ${styles.alertError}` : ` ${styles.alertOk}`}`}>{error || message}</div>}

        <section className={styles.gallerySection}>
          <div className={styles.galleryHead}>
            <h2 className={styles.sectionTitle}>{t('Vorhandene Nachrichten', 'Существующие новости')}</h2>
            <button type="button" className={styles.ghostAction} onClick={loadEntries}>{t('Liste aktualisieren', 'Обновить список')}</button>
          </div>

          {loading ? (
            <p className={styles.empty}>{t('Nachrichten werden geladen...', 'Загрузка новостей...')}</p>
          ) : entries.length === 0 ? (
            <p className={styles.empty}>{t('Noch keine News vorhanden.', 'Новостей пока нет.')}</p>
          ) : (
            <div className={styles.newsEntryList}>
              {entries.map((entry) => {
                const article = entry.de ?? entry.en
                return (
                  <article key={entry.slug} className={styles.newsEntry}>
                    <div>
                      <div className={styles.newsEntryMeta}>
                        <span>{article?.draft ? t('Entwurf', 'Черновик') : t('Veröffentlicht', 'Опубликовано')}</span>
                        <span>{entry.slug}</span>
                        <span>{article?.publishedAt.slice(0, 10)}</span>
                      </div>
                      <h3 className={styles.newsEntryTitle}>{article?.title ?? entry.slug}</h3>
                      <p>{article?.excerpt}</p>
                    </div>
                    <div className={styles.newsEntryActions}>
                      {!article?.draft && <Link href={`/news/${entry.slug}`} className={styles.ghostAction} target="_blank">{t('Öffnen', 'Открыть')}</Link>}
                      <button type="button" className={styles.ghostAction} onClick={() => beginEdit(entry)}>{t('Bearbeiten', 'Редактировать')}</button>
                      <button type="button" className={styles.dangerAction} onClick={() => handleDelete(entry)} disabled={deleting === entry.slug}>{deleting === entry.slug ? '...' : t('Löschen', 'Удалить')}</button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
