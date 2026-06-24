'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminLang } from '@/lib/admin-lang'
import type { AdminMenuCategory, AdminMenuDish } from '@/lib/menu-types'
import styles from './admin-gallery-manager.module.css'

type ApiMenuResponse = {
  categories?: AdminMenuCategory[]
  dishes?: AdminMenuDish[]
  error?: string
}

type ApiMutationResponse = {
  success?: boolean
  error?: string
}

const navItems = [
  { href: '/admin/gallery', titleDe: 'Galerie', titleRu: 'Галерея', subtitleDe: 'Fotos und Konvertierung', subtitleRu: 'Фото и конвертация' },
  { href: '/admin/menu', active: true, titleDe: 'Menü', titleRu: 'Меню', subtitleDe: 'Kategorien und Gerichte', subtitleRu: 'Категории и блюда' },
  { href: '/admin/news', titleDe: 'Nachrichten', titleRu: 'Новости', subtitleDe: 'Markdown und SEO', subtitleRu: 'Markdown и SEO' },
  { href: '/', titleDe: 'Website', titleRu: 'Сайт', subtitleDe: 'Startseite öffnen', subtitleRu: 'Открыть главную' },
]

export default function AdminMenuManager() {
  const router = useRouter()
  const { lang, setLang, t } = useAdminLang()
  const dishPhotoInputRef = useRef<HTMLInputElement | null>(null)

  const [categories, setCategories] = useState<AdminMenuCategory[]>([])
  const [dishes, setDishes] = useState<AdminMenuDish[]>([])
  const [loading, setLoading] = useState(true)
  const [addingCategory, setAddingCategory] = useState(false)
  const [addingDish, setAddingDish] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingCategoryKey, setEditingCategoryKey] = useState<string | null>(null)
  const [editingDishId, setEditingDishId] = useState<string | null>(null)

  const [categoryDe, setCategoryDe] = useState('')
  const [categoryEn, setCategoryEn] = useState('')
  const [categoryKey, setCategoryKey] = useState('')

  const [dishCategory, setDishCategory] = useState('')
  const [dishNameDe, setDishNameDe] = useState('')
  const [dishNameEn, setDishNameEn] = useState('')
  const [dishDescDe, setDishDescDe] = useState('')
  const [dishDescEn, setDishDescEn] = useState('')
  const [dishTagDe, setDishTagDe] = useState('')
  const [dishTagEn, setDishTagEn] = useState('')
  const [dishPrice, setDishPrice] = useState('')
  const [dishId, setDishId] = useState('')
  const [dishPhoto, setDishPhoto] = useState<File | null>(null)

  const isEditingCategory = editingCategoryKey !== null
  const isEditingDish = editingDishId !== null

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.de.localeCompare(b.de, lang === 'ru' ? 'ru' : 'de')),
    [categories, lang]
  )

  const sortedDishes = useMemo(
    () => [...dishes].sort((a, b) => a.nameDe.localeCompare(b.nameDe, lang === 'ru' ? 'ru' : 'de')),
    [dishes, lang]
  )

  const loadMenu = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/menu', { cache: 'no-store' })
      const payload = (await response.json().catch(() => ({}))) as ApiMenuResponse

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!response.ok) {
        setError(
          lang === 'ru'
            ? (payload.error ?? t('Menü konnte nicht geladen werden.', 'Не удалось загрузить меню.'))
            : t('Menü konnte nicht geladen werden.', 'Не удалось загрузить меню.')
        )
        return
      }

      setCategories(payload.categories ?? [])
      setDishes(payload.dishes ?? [])
    } catch (loadError) {
      console.error('[Admin menu load]', loadError)
      setError(t('Fehler beim Laden der Menüdaten.', 'Ошибка загрузки данных меню.'))
    } finally {
      setLoading(false)
    }
  }, [lang, router, t])

  useEffect(() => {
    void loadMenu()
  }, [loadMenu])

  useEffect(() => {
    if (categories.length === 0) return
    if (!categories.some((item) => item.key === dishCategory)) {
      setDishCategory(categories[0].key)
    }
  }, [categories, dishCategory])

  function resetCategoryForm() {
    setEditingCategoryKey(null)
    setCategoryDe('')
    setCategoryEn('')
    setCategoryKey('')
  }

  function resetDishForm() {
    setEditingDishId(null)
    setDishNameDe('')
    setDishNameEn('')
    setDishDescDe('')
    setDishDescEn('')
    setDishTagDe('')
    setDishTagEn('')
    setDishPrice('')
    setDishId('')
    setDishPhoto(null)
    if (dishPhotoInputRef.current) {
      dishPhotoInputRef.current.value = ''
    }
  }

  function beginCategoryEdit(category: AdminMenuCategory) {
    setEditingCategoryKey(category.key)
    setCategoryDe(category.de)
    setCategoryEn(category.en)
    setCategoryKey(category.key)
  }

  function beginDishEdit(dish: AdminMenuDish) {
    setEditingDishId(dish.id)
    setDishCategory(dish.category)
    setDishNameDe(dish.nameDe)
    setDishNameEn(dish.nameEn)
    setDishDescDe(dish.descDe)
    setDishDescEn(dish.descEn)
    setDishTagDe(dish.tagDe)
    setDishTagEn(dish.tagEn)
    setDishPrice(dish.price)
    setDishId(dish.id)
    setDishPhoto(null)
    if (dishPhotoInputRef.current) {
      dishPhotoInputRef.current.value = ''
    }
  }

  async function handleAddCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAddingCategory(true)
    setMessage('')
    setError('')

    try {
      const formData = new FormData()
      formData.append('action', isEditingCategory ? 'update-category' : 'create-category')
      formData.append('de', categoryDe)
      formData.append('en', categoryEn)
      formData.append('key', categoryKey)
      if (isEditingCategory && editingCategoryKey) {
        formData.append('originalKey', editingCategoryKey)
      }

      const response = await fetch('/api/admin/menu', { method: 'POST', body: formData })
      const payload = (await response.json().catch(() => ({}))) as ApiMutationResponse

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!response.ok) {
        setError(
          lang === 'ru'
            ? (payload.error ?? t('Kategorie konnte nicht gespeichert werden.', 'Не удалось добавить категорию.'))
            : t('Kategorie konnte nicht gespeichert werden.', 'Не удалось добавить категорию.')
        )
        return
      }

      setMessage(
        isEditingCategory
          ? t('Kategorie aktualisiert.', 'Категория обновлена.')
          : t('Kategorie hinzugefügt.', 'Категория добавлена.')
      )
      resetCategoryForm()
      await loadMenu()
    } catch (submitError) {
      console.error('[Admin menu add category]', submitError)
      setError(t('Fehler beim Speichern der Kategorie.', 'Ошибка добавления категории.'))
    } finally {
      setAddingCategory(false)
    }
  }

  async function handleAddDish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAddingDish(true)
    setMessage('')
    setError('')

    try {
      if (!dishPhoto && !isEditingDish) {
        setError(t('Bitte wählen Sie vor dem Hinzufügen ein Foto aus.', 'Выберите фото блюда перед добавлением.'))
        return
      }

      const formData = new FormData()
      formData.append('action', isEditingDish ? 'update-dish' : 'create-dish')
      if (dishPhoto) {
        formData.append('photo', dishPhoto)
      }
      formData.append('category', dishCategory)
      formData.append('nameDe', dishNameDe)
      formData.append('nameEn', dishNameEn)
      formData.append('descDe', dishDescDe)
      formData.append('descEn', dishDescEn)
      formData.append('tagDe', dishTagDe)
      formData.append('tagEn', dishTagEn)
      formData.append('price', dishPrice)
      formData.append('id', dishId)
      if (isEditingDish && editingDishId) {
        formData.append('originalId', editingDishId)
      }

      const response = await fetch('/api/admin/menu', { method: 'POST', body: formData })
      const payload = (await response.json().catch(() => ({}))) as ApiMutationResponse

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!response.ok) {
        setError(
          lang === 'ru'
            ? (payload.error ?? t('Gericht konnte nicht gespeichert werden.', 'Не удалось добавить блюдо.'))
            : t('Gericht konnte nicht gespeichert werden.', 'Не удалось добавить блюдо.')
        )
        return
      }

      setMessage(
        isEditingDish
          ? t('Gericht aktualisiert.', 'Блюдо обновлено.')
          : t('Gericht hinzugefügt und Foto in WebP konvertiert.', 'Блюдо добавлено и фото сконвертировано в WebP.')
      )
      resetDishForm()
      await loadMenu()
    } catch (submitError) {
      console.error('[Admin menu add dish]', submitError)
      setError(t('Fehler beim Speichern des Gerichts.', 'Ошибка добавления блюда.'))
    } finally {
      setAddingDish(false)
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
          {navItems.map((item) => (
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
            <p className={styles.kicker}>{t('Admin / Menü', 'Админ / Меню')}</p>
            <h1 className={styles.title}>{t('Menü-Editor', 'Редактор меню')}</h1>
            <p className={styles.subtitle}>
              {t(
                'Fügen Sie Kategorien und Gerichte hinzu. Fotos werden automatisch für Mobile und Desktop in WebP konvertiert.',
                'Добавляйте категории и блюда. Фото автоматически конвертируется в WebP для mobile и desktop.'
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
            <button type="button" className={styles.ghostAction} onClick={loadMenu}>
              {t('Aktualisieren', 'Обновить')}
            </button>
          </div>
        </header>

        <section className={styles.queueSection}>
          <div className={styles.queueHead}>
            <h3>{t('Kategorien', 'Категории')} ({sortedCategories.length})</h3>
          </div>

          <form className={styles.uploadForm} onSubmit={handleAddCategory}>
            <label className={styles.label} htmlFor="menu-category-de">{t('Name (DE)', 'Название (DE)')}</label>
            <input
              id="menu-category-de"
              className={styles.field}
              value={categoryDe}
              onChange={(event) => setCategoryDe(event.target.value)}
              placeholder={t('Zum Beispiel: Desserts', 'Например: Desserts')}
              required
            />

            <label className={styles.label} htmlFor="menu-category-en">{t('Name (EN)', 'Название (EN)')}</label>
            <input
              id="menu-category-en"
              className={styles.field}
              value={categoryEn}
              onChange={(event) => setCategoryEn(event.target.value)}
              placeholder={t('Optional, sonst wie DE', 'Optional, иначе будет как DE')}
            />

            <label className={styles.label} htmlFor="menu-category-key">{t('Kategorie-Schlüssel', 'Ключ категории')}</label>
            <input
              id="menu-category-key"
              className={styles.field}
              value={categoryKey}
              onChange={(event) => setCategoryKey(event.target.value)}
              placeholder={t('Optional, z. B. desserts', 'Optional, например desserts')}
              disabled={isEditingCategory}
            />

            <button type="submit" className={styles.pickBtn} disabled={addingCategory}>
              {addingCategory
                ? t('Speichern...', 'Сохранение...')
                : isEditingCategory
                  ? t('Kategorie speichern', 'Сохранить категорию')
                  : t('Kategorie hinzufügen', 'Добавить категорию')}
            </button>
            {isEditingCategory && (
              <button type="button" className={styles.linkBtn} onClick={resetCategoryForm}>
                {t('Bearbeitung abbrechen', 'Отменить редактирование')}
              </button>
            )}
          </form>

          {sortedCategories.length === 0 ? (
            <p className={styles.empty}>{t('Noch keine Kategorien.', 'Пока нет категорий.')}</p>
          ) : (
            <ul className={styles.queueList}>
              {sortedCategories.map((item) => (
                <li key={item.key} className={styles.queueItem}>
                  <span>{item.de} / {item.en}</span>
                  <span>{item.key} · {item.source === 'upload' ? t('Hinzugefügt', 'Добавлено') : t('Basis', 'Базовое')}</span>
                  <button type="button" onClick={() => beginCategoryEdit(item)}>
                    {t('Bearbeiten', 'Редактировать')}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.uploadSection}>
          <form className={styles.uploadForm} onSubmit={handleAddDish}>
            <h2 className={styles.sectionTitle}>{isEditingDish ? t('Gericht bearbeiten', 'Редактировать блюдо') : t('Gericht hinzufügen', 'Добавить блюдо')}</h2>

            <label className={styles.label} htmlFor="menu-dish-category">{t('Kategorie', 'Категория')}</label>
            <input
              id="menu-dish-category"
              className={styles.field}
              list="menu-category-list"
              value={dishCategory}
              onChange={(event) => setDishCategory(event.target.value)}
              required
            />
            <datalist id="menu-category-list">
              {sortedCategories.map((item) => (
                <option key={item.key} value={item.key}>{item.de}</option>
              ))}
            </datalist>

            <label className={styles.label} htmlFor="menu-name-de">{t('Name (DE)', 'Название (DE)')}</label>
            <input
              id="menu-name-de"
              className={styles.field}
              value={dishNameDe}
              onChange={(event) => setDishNameDe(event.target.value)}
              required
            />

            <label className={styles.label} htmlFor="menu-name-en">{t('Name (EN)', 'Название (EN)')}</label>
            <input
              id="menu-name-en"
              className={styles.field}
              value={dishNameEn}
              onChange={(event) => setDishNameEn(event.target.value)}
            />

            <label className={styles.label} htmlFor="menu-desc-de">{t('Beschreibung (DE)', 'Описание (DE)')}</label>
            <input
              id="menu-desc-de"
              className={styles.field}
              value={dishDescDe}
              onChange={(event) => setDishDescDe(event.target.value)}
              required
            />

            <label className={styles.label} htmlFor="menu-desc-en">{t('Beschreibung (EN)', 'Описание (EN)')}</label>
            <input
              id="menu-desc-en"
              className={styles.field}
              value={dishDescEn}
              onChange={(event) => setDishDescEn(event.target.value)}
            />

            <label className={styles.label} htmlFor="menu-tag-de">{t('Tag (DE)', 'Тег (DE)')}</label>
            <input
              id="menu-tag-de"
              className={styles.field}
              value={dishTagDe}
              onChange={(event) => setDishTagDe(event.target.value)}
            />

            <label className={styles.label} htmlFor="menu-tag-en">{t('Tag (EN)', 'Тег (EN)')}</label>
            <input
              id="menu-tag-en"
              className={styles.field}
              value={dishTagEn}
              onChange={(event) => setDishTagEn(event.target.value)}
            />

            <label className={styles.label} htmlFor="menu-price">{t('Preis', 'Цена')}</label>
            <input
              id="menu-price"
              className={styles.field}
              value={dishPrice}
              onChange={(event) => setDishPrice(event.target.value)}
              placeholder={t('Zum Beispiel: 9,90€', 'Например: 9,90€')}
              required
            />

            <label className={styles.label} htmlFor="menu-id">{t('ID (optional)', 'ID (optional)')}</label>
            <input
              id="menu-id"
              className={styles.field}
              value={dishId}
              onChange={(event) => setDishId(event.target.value)}
              placeholder={t('Zum Beispiel: tiramisu', 'Например: tiramisu')}
              disabled={isEditingDish}
            />

            <button type="button" className={styles.pickBtn} onClick={() => dishPhotoInputRef.current?.click()}>
              {dishPhoto
                ? `${t('Foto', 'Фото')}: ${dishPhoto.name}`
                : isEditingDish
                  ? t('Foto aktualisieren (optional)', 'Обновить фото (optional)')
                  : t('Foto des Gerichts auswählen', 'Выбрать фото блюда')}
            </button>
            <input
              ref={dishPhotoInputRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setDishPhoto(event.target.files?.[0] ?? null)}
            />

            <button type="submit" className={`${styles.primaryAction} ${styles.formPrimaryAction}`} disabled={addingDish}>
              {addingDish
                ? t('Speichern...', 'Сохранение...')
                : isEditingDish
                  ? t('Gericht speichern', 'Сохранить блюдо')
                  : t('Gericht hinzufügen', 'Добавить блюдо')}
            </button>
            {isEditingDish && (
              <button type="button" className={styles.linkBtn} onClick={resetDishForm}>
                {t('Bearbeitung abbrechen', 'Отменить редактирование')}
              </button>
            )}
          </form>

          <div className={styles.dropzone}>
            <div className={styles.dropIcon}>M</div>
            <p className={styles.dropTitle}>{t('Fügen Sie Gerichte mit Foto hinzu', 'Добавляйте блюда с фото')}</p>
            <p className={styles.dropText}>
              {t(
                'Hochgeladene Bilder werden automatisch in WebP konvertiert: Desktop (1600px) und Mobile (900px).',
                'Загруженные изображения автоматически конвертируются в WebP: desktop (1600px) и mobile (900px).'
              )}
            </p>
          </div>
        </section>

        {(message || error) && (
          <div className={`${styles.alert}${error ? ` ${styles.alertError}` : ` ${styles.alertOk}`}`}>
            {error || message}
          </div>
        )}

        <section className={styles.gallerySection}>
          <div className={styles.galleryHead}>
            <h2>{t('Gerichte im Menü', 'Блюда в меню')} ({sortedDishes.length})</h2>
            <button type="button" className={styles.ghostAction} onClick={loadMenu}>
              {t('Liste aktualisieren', 'Обновить список')}
            </button>
          </div>

          {loading ? (
            <p className={styles.empty}>{t('Menü wird geladen...', 'Загрузка меню...')}</p>
          ) : sortedDishes.length === 0 ? (
            <p className={styles.empty}>{t('Noch keine Gerichte hinzugefügt.', 'Блюда пока не добавлены.')}</p>
          ) : (
            <div className={styles.galleryGrid}>
              {sortedDishes.map((dish) => (
                <article key={dish.id} className={styles.galleryCard}>
                  <picture>
                    <source media="(max-width: 768px)" srcSet={dish.imgMobile} />
                    <img src={dish.imgDesktop} alt={dish.nameDe} loading="lazy" />
                  </picture>
                  <div className={styles.cardMeta}>
                    <span
                      className={`${styles.cardSource} ${dish.source === 'upload' ? styles.cardSourceUpload : styles.cardSourceStatic}`}
                    >
                      {dish.source === 'upload' ? t('Hinzugefügt', 'Добавлено') : t('Basis', 'Базовое')}
                    </span>
                    <span className={styles.cardTag}>{dish.category}</span>
                    <span className={styles.cardDate}>{dish.price}</span>
                  </div>
                  <button type="button" className={styles.cardEditBtn} onClick={() => beginDishEdit(dish)}>
                    {t('Bearbeiten', 'Редактировать')}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
