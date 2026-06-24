'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { AdminLang } from '@/lib/admin-lang'
import { useAdminLang } from '@/lib/admin-lang'
import type { AdminGalleryItem } from '@/lib/gallery-types'
import styles from './admin-gallery-manager.module.css'

type ApiGalleryResponse = {
  items?: AdminGalleryItem[]
  error?: string
}

type ApiUploadResponse = {
  success?: boolean
  total?: number
  skipped?: { file: string; reason: string }[]
  error?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatDate(isoDate: string, lang: AdminLang): string {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString(lang === 'ru' ? 'ru-RU' : 'de-DE', { dateStyle: 'short', timeStyle: 'short' })
}

const sidebarItems = [
  { href: '/admin/gallery', active: true, titleDe: 'Galerie', titleRu: 'Галерея', subtitleDe: 'Fotos und Konvertierung', subtitleRu: 'Фото и конвертация' },
  { href: '/admin/menu', titleDe: 'Menü', titleRu: 'Меню', subtitleDe: 'Kategorien und Gerichte', subtitleRu: 'Категории и блюда' },
  { href: '/admin/news', titleDe: 'Nachrichten', titleRu: 'Новости', subtitleDe: 'Markdown und SEO', subtitleRu: 'Markdown и SEO' },
  { href: '/', titleDe: 'Website', titleRu: 'Сайт', subtitleDe: 'Startseite öffnen', subtitleRu: 'Открыть главную' },
]

const TAG_OPTIONS = [
  { value: 'Innenraum', de: 'Innenraum', ru: 'Интерьер' },
  { value: 'Küche', de: 'Küche', ru: 'Кухня' },
  { value: 'Events', de: 'Events', ru: 'События' },
  { value: 'Terrasse', de: 'Terrasse', ru: 'Терраса' },
  { value: 'Sonstiges', de: 'Sonstiges', ru: 'Другое' },
] as const

type GalleryTag = (typeof TAG_OPTIONS)[number]['value']

export default function AdminGalleryManager() {
  const router = useRouter()
  const { lang, setLang, t } = useAdminLang()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const tagMenuRef = useRef<HTMLDivElement | null>(null)

  const [tag, setTag] = useState<GalleryTag>(TAG_OPTIONS[0].value)
  const [altPrefix, setAltPrefix] = useState('')
  const [queue, setQueue] = useState<File[]>([])
  const [items, setItems] = useState<AdminGalleryItem[]>([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [tagMenuOpen, setTagMenuOpen] = useState(false)
  const selectedTagOption = TAG_OPTIONS.find((option) => option.value === tag) ?? TAG_OPTIONS[0]

  const queueSize = useMemo(() => queue.reduce((sum, file) => sum + file.size, 0), [queue])

  const loadItems = useCallback(async () => {
    setLoadingItems(true)
    setError('')

    try {
      const response = await fetch('/api/admin/gallery', { cache: 'no-store' })
      const payload = (await response.json().catch(() => ({}))) as ApiGalleryResponse

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!response.ok) {
        setError(
          lang === 'ru'
            ? (payload.error ?? t('Fotoliste konnte nicht geladen werden.', 'Не удалось загрузить список фото.'))
            : t('Fotoliste konnte nicht geladen werden.', 'Не удалось загрузить список фото.')
        )
        return
      }

      setItems(payload.items ?? [])
    } catch (loadError) {
      console.error('[Admin gallery load]', loadError)
      setError(t('Fehler beim Laden der Daten.', 'Ошибка загрузки данных.'))
    } finally {
      setLoadingItems(false)
    }
  }, [lang, router, t])

  useEffect(() => {
    void loadItems()
  }, [loadItems])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!tagMenuRef.current) return
      if (event.target instanceof Node && !tagMenuRef.current.contains(event.target)) {
        setTagMenuOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setTagMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const appendFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter((file) => file.type.startsWith('image/'))
    if (imageFiles.length === 0) {
      setError(t('Bitte fügen Sie Bilddateien hinzu (jpg, png, webp, avif usw.).', 'Добавьте файлы изображений (jpg, png, webp, avif и т.д.).'))
      return
    }

    setError('')
    setQueue((prev) => [...prev, ...imageFiles])
  }, [t])

  function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? [])
    appendFiles(selected)
    event.target.value = ''
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragActive(true)
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragActive(false)
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragActive(false)
    const dropped = Array.from(event.dataTransfer.files ?? [])
    appendFiles(dropped)
  }

  function removeQueueFile(index: number) {
    setQueue((prev) => prev.filter((_, fileIndex) => fileIndex !== index))
  }

  function clearQueue() {
    setQueue([])
  }

  async function handleUpload() {
    if (queue.length === 0) {
      setError(t('Warteschlange ist leer. Bitte fügen Sie Fotos vor dem Upload hinzu.', 'Очередь пуста. Добавьте фото перед загрузкой.'))
      return
    }

    setUploading(true)
    setMessage('')
    setError('')

    try {
      const formData = new FormData()
      queue.forEach((file) => formData.append('files', file))
      formData.append('tag', tag)
      formData.append('alt', altPrefix)

      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        body: formData,
      })

      const payload = (await response.json().catch(() => ({}))) as ApiUploadResponse

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!response.ok) {
        setError(
          lang === 'ru'
            ? (payload.error ?? t('Bilder konnten nicht hochgeladen werden.', 'Не удалось загрузить изображения.'))
            : t('Bilder konnten nicht hochgeladen werden.', 'Не удалось загрузить изображения.')
        )
        return
      }

      const skippedCount = payload.skipped?.length ?? 0
      const successMessage = skippedCount > 0
        ? t(
          `Upload abgeschlossen: Einige Dateien wurden übersprungen (${skippedCount}).`,
          `Загрузка завершена: часть файлов пропущена (${skippedCount}).`
        )
        : t('Fotos wurden erfolgreich hochgeladen und in WebP konvertiert.', 'Фото успешно загружены и конвертированы в WebP.')

      setMessage(successMessage)
      setQueue([])
      await loadItems()
    } catch (uploadError) {
      console.error('[Admin gallery upload]', uploadError)
      setError(t('Upload-Fehler. Bitte prüfen Sie die Dateien und versuchen Sie es erneut.', 'Ошибка загрузки. Проверьте файлы и повторите попытку.'))
    } finally {
      setUploading(false)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch (logoutError) {
      console.error('[Admin logout]', logoutError)
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
          {sidebarItems.map((item) => (
            <Link
              key={item.titleDe}
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
            <p className={styles.kicker}>{t('Admin / Galerie', 'Админ / Галерея')}</p>
            <h1 className={styles.title}>{t('Galerie-Manager', 'Галерея работ')}</h1>
            <p className={styles.subtitle}>
              {t(
                'Laden Sie Fotos in jedem Format hoch. Adaptive WebP-Konvertierung erfolgt automatisch.',
                'Загрузка фото в любом формате с автоматической адаптивной конвертацией в WebP.'
              )}
            </p>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.langSwitch}>
              <button
                type="button"
                className={`${styles.langBtn}${lang === 'de' ? ` ${styles.langBtnActive}` : ''}`}
                onClick={() => setLang('de')}
              >
                DE
              </button>
              <button
                type="button"
                className={`${styles.langBtn}${lang === 'ru' ? ` ${styles.langBtnActive}` : ''}`}
                onClick={() => setLang('ru')}
              >
                RU
              </button>
            </div>
            <button type="button" className={styles.ghostAction} onClick={loadItems}>
              {t('Aktualisieren', 'Обновить')}
            </button>
            <button type="button" className={styles.primaryAction} onClick={handleUpload} disabled={uploading}>
              {uploading ? t('Upload...', 'Загрузка...') : t('Upload starten', 'Сделать загрузку')}
            </button>
          </div>
        </header>

        <section className={styles.uploadSection}>
          <div className={styles.uploadForm}>
            <h2 className={styles.sectionTitle}>{t('Upload-Einstellungen', 'Параметры загрузки')}</h2>

            <label className={styles.label} htmlFor="admin-tag">{t('Kategorie', 'Категория')}</label>
            <div className={styles.selectWrap} ref={tagMenuRef}>
              <button
                id="admin-tag"
                type="button"
                className={`${styles.selectTrigger}${tagMenuOpen ? ` ${styles.selectTriggerOpen}` : ''}`}
                onClick={() => setTagMenuOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={tagMenuOpen}
              >
                <span>{t(selectedTagOption.de, selectedTagOption.ru)}</span>
                <span
                  className={`${styles.selectChevron}${tagMenuOpen ? ` ${styles.selectChevronOpen}` : ''}`}
                  aria-hidden="true"
                >
                  ▾
                </span>
              </button>

              {tagMenuOpen && (
                <ul className={styles.selectMenu} role="listbox" aria-label={t('Kategorie', 'Категория')}>
                  {TAG_OPTIONS.map((option) => (
                    <li key={option.value}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={tag === option.value}
                        className={`${styles.selectOption}${tag === option.value ? ` ${styles.selectOptionActive}` : ''}`}
                        onClick={() => {
                          setTag(option.value)
                          setTagMenuOpen(false)
                        }}
                      >
                        {t(option.de, option.ru)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label className={styles.label} htmlFor="admin-alt">{t('Beschreibung (ALT-Präfix)', 'Описание (префикс ALT)')}</label>
            <input
              id="admin-alt"
              className={styles.field}
              value={altPrefix}
              onChange={(event) => setAltPrefix(event.target.value)}
              placeholder={t('Zum Beispiel: Innenraum des Restaurants', 'Например: Интерьер ресторана')}
            />

            <button
              type="button"
              className={styles.pickBtn}
              onClick={() => fileInputRef.current?.click()}
            >
              {t('Fotos auswählen', 'Выбрать фото')}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInputChange}
              className={styles.fileInput}
            />
          </div>

          <div
            className={`${styles.dropzone}${dragActive ? ` ${styles.dropzoneActive}` : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className={styles.dropIcon}>⇪</div>
            <p className={styles.dropTitle}>{t('Ziehen Sie Fotos hierher oder klicken Sie auf "Fotos auswählen"', 'Перетащите фото сюда или нажмите “Выбрать фото”')}</p>
            <p className={styles.dropText}>
              {t(
                'Alle Bildformate werden unterstützt. WebP-Versionen für Mobile und Desktop werden automatisch erstellt.',
                'Поддерживаются любые изображения. На выходе автоматически создаются WebP для mobile и desktop.'
              )}
            </p>
          </div>
        </section>

        <section className={styles.queueSection}>
          <div className={styles.queueHead}>
            <h3>{t('Warteschlange', 'Очередь')}: {queue.length} {t('Datei(en)', 'файл(ов)')}, {formatBytes(queueSize)}</h3>
            <button type="button" onClick={clearQueue} className={styles.linkBtn}>{t('Warteschlange leeren', 'Очистить очередь')}</button>
          </div>

          {queue.length === 0 ? (
            <p className={styles.empty}>{t('Warteschlange ist leer. Fügen Sie Fotos per Drag-and-drop oder über die Schaltfläche hinzu.', 'Очередь пуста. Добавьте фото через drag-and-drop или кнопку выбора.')}</p>
          ) : (
            <ul className={styles.queueList}>
              {queue.map((file, index) => (
                <li key={`${file.name}-${index}`} className={styles.queueItem}>
                  <span>{file.name}</span>
                  <span>{formatBytes(file.size)}</span>
                  <button type="button" onClick={() => removeQueueFile(index)}>{t('Entfernen', 'Удалить')}</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {(message || error) && (
          <div className={`${styles.alert}${error ? ` ${styles.alertError}` : ` ${styles.alertOk}`}`}>
            {error || message}
          </div>
        )}

        <section className={styles.gallerySection}>
          <div className={styles.galleryHead}>
            <h2>{t('Fotos in der Galerie', 'Фото в галерее')} ({items.length})</h2>
            <button type="button" className={styles.ghostAction} onClick={loadItems}>
              {t('Liste aktualisieren', 'Обновить список')}
            </button>
          </div>

          {loadingItems ? (
            <p className={styles.empty}>{t('Liste wird geladen...', 'Загрузка списка...')}</p>
          ) : items.length === 0 ? (
            <p className={styles.empty}>{t('Noch keine Fotos in der Galerie.', 'Пока нет фото в галерее.')}</p>
          ) : (
            <div className={styles.galleryGrid}>
              {items.map((item) => (
                <article key={item.id} className={styles.galleryCard}>
                  <picture>
                    <source media="(max-width: 768px)" srcSet={item.mobile} />
                    <img src={item.desktop} alt={item.alt} loading="lazy" />
                  </picture>
                  <div className={styles.cardMeta}>
                    <span
                      className={`${styles.cardSource} ${item.source === 'static' ? styles.cardSourceStatic : styles.cardSourceUpload}`}
                    >
                      {item.source === 'static' ? t('Basis', 'Системное') : t('Hochgeladen', 'Загружено')}
                    </span>
                    <span className={styles.cardTag}>{item.tag}</span>
                    <span className={styles.cardDate}>
                      {item.source === 'static' ? t('Basisgalerie', 'Базовая галерея') : formatDate(item.createdAt, lang)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
