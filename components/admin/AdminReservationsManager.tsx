'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminLang } from '@/lib/admin-lang'
import { isWithinOpeningHours, openingHoursForDate } from '@/lib/reservation-datetime'
import base from './admin-gallery-manager.module.css'
import styles from './admin-reservations-manager.module.css'

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW'
type Occasion = 'DINNER' | 'BIRTHDAY' | 'WEDDING' | 'CORPORATE' | 'OTHER'
type Reservation = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  occasion: Occasion
  specialRequest: string | null
  status: ReservationStatus
  lang: string
  createdAt: string
  updatedAt: string
  cancelledAt: string | null
  cancellationReason: string | null
  confirmationEmailSentAt: string | null
  cancellationManagerEmailSentAt: string | null
  cancellationGuestEmailSentAt: string | null
}

type EditForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  occasion: Occasion
  specialRequest: string
  lang: 'de' | 'en'
}

type ApiResponse = {
  items?: Reservation[]
  total?: number
  status?: string
  notification?: string
  error?: string
}

const navItems = [
  { href: '/admin/reservations', active: true, titleDe: 'Reservierungen', titleRu: 'Бронирования', subtitleDe: 'Anfragen und Tische', subtitleRu: 'Заявки и столики' },
  { href: '/admin/gallery', titleDe: 'Galerie', titleRu: 'Галерея', subtitleDe: 'Fotos und Konvertierung', subtitleRu: 'Фото и конвертация' },
  { href: '/admin/menu', titleDe: 'Menü', titleRu: 'Меню', subtitleDe: 'Kategorien und Gerichte', subtitleRu: 'Категории и блюда' },
  { href: '/admin/news', titleDe: 'Nachrichten', titleRu: 'Новости', subtitleDe: 'Markdown und SEO', subtitleRu: 'Markdown и SEO' },
  { href: '/', titleDe: 'Website', titleRu: 'Сайт', subtitleDe: 'Startseite öffnen', subtitleRu: 'Открыть главную' },
]

const statusLabels: Record<ReservationStatus, [string, string]> = {
  PENDING: ['Anfrage', 'Ожидает'],
  CONFIRMED: ['Bestätigt', 'Подтверждено'],
  CANCELLED: ['Storniert', 'Отменено'],
  NO_SHOW: ['Nicht erschienen', 'Не пришли'],
}

const occasionLabels: Record<Occasion, [string, string]> = {
  DINNER: ['Abendessen', 'Ужин'],
  BIRTHDAY: ['Geburtstag', 'День рождения'],
  WEDDING: ['Hochzeit', 'Свадьба'],
  CORPORATE: ['Firmenfeier', 'Корпоратив'],
  OTHER: ['Sonstiges', 'Другое'],
}

function editForm(item: Reservation): EditForm {
  return {
    firstName: item.firstName,
    lastName: item.lastName,
    email: item.email,
    phone: item.phone,
    date: item.date.slice(0, 10),
    time: item.time,
    guests: String(item.guests),
    occasion: item.occasion,
    specialRequest: item.specialRequest ?? '',
    lang: item.lang === 'en' ? 'en' : 'de',
  }
}

function formatStamp(value: string, locale: 'de' | 'ru') {
  return new Date(value).toLocaleString(locale === 'ru' ? 'ru-RU' : 'de-DE', {
    timeZone: 'Europe/Berlin', dateStyle: 'short', timeStyle: 'short',
  })
}

type EditorProps = {
  item: Reservation
  busy: boolean
  onAction: (action: string, payload?: object) => Promise<void>
  t: (de: string, ru: string) => string
}

function ReservationEditor({ item, busy, onAction, t }: EditorProps) {
  const [form, setForm] = useState<EditForm>(() => editForm(item))
  const [reason, setReason] = useState(item.cancellationReason ?? '')
  const hours = openingHoursForDate(form.date)
  const hasChanges = JSON.stringify(form) !== JSON.stringify(editForm(item))

  function field(name: keyof EditForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onAction('save', {
      updatedAt: item.updatedAt,
      reservation: { ...form, guests: Number(form.guests) },
    })
  }

  async function cancel() {
    if (!window.confirm(t('Diese Reservierung wirklich stornieren?', 'Отменить это бронирование?'))) return
    await onAction('cancel', { reason })
  }

  return (
    <section className={styles.editor} aria-label={t('Reservierung bearbeiten', 'Редактирование брони')}>
      <div className={styles.editorHead}>
        <div>
          <p className={base.kicker}>{t('Reservierung', 'Бронирование')} · {item.id.slice(0, 8)}</p>
          <h2>{item.firstName} {item.lastName}</h2>
        </div>
        <span className={`${styles.badge} ${styles[`badge${item.status}`]}`}>{t(...statusLabels[item.status])}</span>
      </div>

      <div className={styles.meta}>
        <span>{t('Anfrage vom', 'Заявка от')} {formatStamp(item.createdAt, t('de', 'ru') as 'de' | 'ru')}</span>
        <span>{t('Bestätigung an Gast', 'Подтверждение гостю')}: {item.confirmationEmailSentAt ? t('gesendet', 'отправлено') : t('ausstehend', 'не отправлено')}</span>
        {item.cancelledAt && <span>{t('Storniert am', 'Отменено')} {formatStamp(item.cancelledAt, t('de', 'ru') as 'de' | 'ru')}</span>}
      </div>

      {item.cancellationReason && (
        <p className={styles.note}><strong>{t('Stornierungsgrund', 'Причина отмены')}:</strong> {item.cancellationReason}</p>
      )}

      <form onSubmit={save} className={styles.form}>
        <div className={styles.fields}>
          <label>{t('Vorname', 'Имя')}<input value={form.firstName} onChange={(event) => field('firstName', event.target.value)} maxLength={100} required /></label>
          <label>{t('Nachname', 'Фамилия')}<input value={form.lastName} onChange={(event) => field('lastName', event.target.value)} maxLength={100} required /></label>
          <label>{t('E-Mail', 'Эл. почта')}<input type="email" value={form.email} onChange={(event) => field('email', event.target.value)} maxLength={254} required /></label>
          <label>{t('Telefon', 'Телефон')}<input type="tel" value={form.phone} onChange={(event) => field('phone', event.target.value)} maxLength={50} /></label>
          <label>{t('Datum', 'Дата')}<input type="date" value={form.date} onChange={(event) => field('date', event.target.value)} required /></label>
          <label>{t('Uhrzeit', 'Время')}<input type="time" value={form.time} onChange={(event) => field('time', event.target.value)} required /></label>
          <label>{t('Personen', 'Гостей')}<input type="number" min={1} max={100} value={form.guests} onChange={(event) => field('guests', event.target.value)} required /></label>
          <label>{t('Anlass', 'Повод')}<select value={form.occasion} onChange={(event) => field('occasion', event.target.value)}>
            {(Object.keys(occasionLabels) as Occasion[]).map((occasion) => <option key={occasion} value={occasion}>{t(...occasionLabels[occasion])}</option>)}
          </select></label>
          <label>{t('Sprache des Gastes', 'Язык гостя')}<select value={form.lang} onChange={(event) => field('lang', event.target.value)}>
            <option value="de">Deutsch</option><option value="en">English</option>
          </select></label>
          <label className={styles.wide}>{t('Sonderwünsche', 'Особые пожелания')}<textarea rows={3} maxLength={2000} value={form.specialRequest} onChange={(event) => field('specialRequest', event.target.value)} /></label>
        </div>
        <p className={styles.hint}>{hours
          ? t(`Öffnungszeiten an diesem Tag: ${hours.opens}–${hours.closes}.`, `В этот день открыто: ${hours.opens}–${hours.closes}.`)
          : t('An diesem Tag geschlossen (Mo/Di).', 'В этот день закрыто (пн/вт).')}</p>
        {!isWithinOpeningHours(form.date, form.time) && <p className={styles.warning}>{t('Diese Uhrzeit liegt außerhalb der Öffnungszeiten.', 'Время вне рабочих часов.')}</p>}
        <button className={styles.primary} type="submit" disabled={busy || !hasChanges}>{t('Änderungen speichern', 'Сохранить изменения')}</button>
      </form>

      <div className={styles.actions}>
        {(item.status === 'PENDING' || item.status === 'CONFIRMED') && (
          <button type="button" onClick={() => void onAction('notify_update')} disabled={busy}>
            {t('Aktuelle Daten per E-Mail senden', 'Отправить данные по почте')}
          </button>
        )}
        {(item.status === 'PENDING' || (item.status === 'CONFIRMED' && !item.confirmationEmailSentAt)) && (
          <button type="button" onClick={() => void onAction('confirm')} disabled={busy}>
            {item.status === 'PENDING' ? t('Tisch bestätigen', 'Подтвердить столик') : t('Bestätigungs-E-Mail erneut senden', 'Повторить письмо с подтверждением')}
          </button>
        )}
        {(item.status === 'PENDING' || item.status === 'CONFIRMED' || item.status === 'CANCELLED') && (
          <div className={styles.cancelBox}>
            {item.status !== 'CANCELLED' && <label>{t('Stornierungsgrund (optional)', 'Причина отмены (необязательно)')}
              <textarea rows={2} maxLength={1000} value={reason} onChange={(event) => setReason(event.target.value)} />
            </label>}
            <button type="button" className={styles.danger} onClick={() => void cancel()} disabled={busy || (item.status === 'CANCELLED' && Boolean(item.cancellationGuestEmailSentAt && item.cancellationManagerEmailSentAt))}>
              {item.status === 'CANCELLED' ? t('E-Mail erneut senden', 'Повторить письма') : t('Reservierung stornieren', 'Отменить бронь')}
            </button>
          </div>
        )}
        {item.status === 'CONFIRMED' && (
          <button type="button" onClick={() => {
            if (window.confirm(t('Diesen Gast als nicht erschienen markieren?', 'Отметить гостя как неявившегося?'))) void onAction('no_show')
          }} disabled={busy}>
            {t('Nicht erschienen markieren', 'Отметить неявку')}
          </button>
        )}
      </div>
    </section>
  )
}

export default function AdminReservationsManager() {
  const router = useRouter()
  const { lang, setLang, t } = useAdminLang()
  const [items, setItems] = useState<Reservation[]>([])
  const [total, setTotal] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [queryDraft, setQueryDraft] = useState('')
  const [query, setQuery] = useState('')
  const [dateDraft, setDateDraft] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ status: filterStatus })
      if (query) params.set('query', query)
      if (date) { params.set('from', date); params.set('to', date) }
      const response = await fetch(`/api/admin/reservations?${params}`, { cache: 'no-store' })
      const payload = (await response.json().catch(() => ({}))) as ApiResponse
      if (response.status === 401) { router.push('/admin/login'); return }
      if (!response.ok) { setError(t('Reservierungen konnten nicht geladen werden.', 'Не удалось загрузить бронирования.')); return }
      const rows = payload.items ?? []
      setItems(rows)
      setTotal(payload.total ?? rows.length)
      setSelectedId((current) => rows.some((row) => row.id === current) ? current : rows[0]?.id ?? null)
    } catch {
      setError(t('Netzwerkfehler beim Laden.', 'Ошибка сети при загрузке.'))
    } finally {
      setLoading(false)
    }
  }, [date, filterStatus, query, router, t])

  useEffect(() => { void loadItems() }, [loadItems])

  async function handleLogout() {
    try { await fetch('/api/admin/logout', { method: 'POST' }) }
    finally { router.push('/admin/login'); router.refresh() }
  }

  async function performAction(action: string, payload: object = {}) {
    if (!selectedId || busy) return
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/admin/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedId, action, ...payload }),
      })
      const result = (await response.json().catch(() => ({}))) as ApiResponse
      if (response.status === 401) { router.push('/admin/login'); return }
      if (!response.ok) {
        const reasons: Record<string, [string, string]> = {
          conflict: ['Die Reservierung wurde inzwischen geändert. Bitte aktualisieren.', 'Бронь уже изменена. Обновите список.'],
          past_reservation: ['Der Termin liegt in der Vergangenheit.', 'Дата и время уже прошли.'],
          outside_opening_hours: ['Der Termin liegt außerhalb der Öffnungszeiten.', 'Время вне рабочих часов.'],
          too_early: ['Noch zu früh für eine Nicht-Erschienen-Markierung.', 'Рано отмечать неявку.'],
        }
        setError(t(...(reasons[result.status ?? result.error ?? ''] ?? ['Aktion fehlgeschlagen. Bitte aktualisieren.', 'Действие не выполнено. Обновите список.'])))
        return
      }
      setMessage(result.status === 'email_failed' || result.status === 'notification_failed' || result.notification === 'failed' || result.notification === 'not_configured'
        ? t('Gespeichert, aber eine E-Mail konnte nicht versendet werden. Bitte erneut versuchen.', 'Сохранено, но письмо не отправилось. Повторите попытку.')
        : result.status === 'processing'
          ? t('Die Benachrichtigung wird bereits verarbeitet.', 'Уведомление уже обрабатывается.')
          : t('Reservierung aktualisiert.', 'Бронирование обновлено.'))
      await loadItems()
    } catch {
      setError(t('Netzwerkfehler. Bitte versuchen Sie es erneut.', 'Ошибка сети. Попробуйте ещё раз.'))
    } finally {
      setBusy(false)
    }
  }

  const selected = items.find((item) => item.id === selectedId) ?? null

  return (
    <div className={base.page}>
      <aside className={base.sidebar}>
        <div className={base.sidebarBrand}>Neue Liebe<span>{t('Admin-Bereich', 'Админ-панель')}</span></div>
        <nav className={base.sidebarNav}>
          {navItems.map((item) => <Link key={item.href} href={item.href} className={`${base.navItem}${item.active ? ` ${base.navItemActive}` : ''}`}>
            <span className={base.navTitle}>{t(item.titleDe, item.titleRu)}</span>
            <span className={base.navSubtitle}>{t(item.subtitleDe, item.subtitleRu)}</span>
          </Link>)}
        </nav>
        <button type="button" className={base.logoutBtn} onClick={() => void handleLogout()}>{t('Admin verlassen', 'Выйти из админки')}</button>
      </aside>

      <main className={base.content}>
        <header className={base.header}>
          <div>
            <p className={base.kicker}>{t('Admin / Reservierungen', 'Админ / Бронирования')}</p>
            <h1 className={base.title}>{t('Tischreservierungen', 'Бронирования столиков')}</h1>
            <p className={base.subtitle}>{t('Anfragen prüfen, Daten ändern und Gäste benachrichtigen.', 'Просмотр заявок, изменение данных и уведомления гостей.')}</p>
          </div>
          <div className={base.headerActions}>
            <div className={base.langSwitch}>
              <button type="button" className={`${base.langBtn}${lang === 'de' ? ` ${base.langBtnActive}` : ''}`} onClick={() => setLang('de')}>DE</button>
              <button type="button" className={`${base.langBtn}${lang === 'ru' ? ` ${base.langBtnActive}` : ''}`} onClick={() => setLang('ru')}>RU</button>
            </div>
            <button type="button" className={base.ghostAction} onClick={() => void loadItems()}>{t('Aktualisieren', 'Обновить')}</button>
          </div>
        </header>

        <form className={styles.filters} onSubmit={(event) => { event.preventDefault(); setQuery(queryDraft.trim()); setDate(dateDraft) }}>
          <label>{t('Status', 'Статус')}<select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
            <option value="ALL">{t('Alle', 'Все')}</option>
            {(Object.keys(statusLabels) as ReservationStatus[]).map((status) => <option key={status} value={status}>{t(...statusLabels[status])}</option>)}
          </select></label>
          <label>{t('Datum', 'Дата')}<input type="date" value={dateDraft} onChange={(event) => setDateDraft(event.target.value)} /></label>
          <label>{t('Name, E-Mail oder Telefon', 'Имя, почта или телефон')}<input type="search" value={queryDraft} onChange={(event) => setQueryDraft(event.target.value)} maxLength={80} /></label>
          <button type="submit">{t('Suchen', 'Найти')}</button>
          <button type="button" onClick={() => { setFilterStatus('ALL'); setQueryDraft(''); setQuery(''); setDateDraft(''); setDate('') }}>{t('Zurücksetzen', 'Сбросить')}</button>
        </form>

        {error && <p className={styles.error} role="alert">{error}</p>}
        {message && <p className={styles.message} role="status">{message}</p>}

        <div className={styles.columns}>
          <section className={styles.list} aria-label={t('Reservierungsliste', 'Список бронирований')}>
            <div className={styles.listHead}><h2>{t('Anfragen', 'Заявки')}</h2><span>{total}{total > 100 ? '+' : ''}</span></div>
            {loading && <p className={styles.empty}>{t('Wird geladen …', 'Загрузка …')}</p>}
            {!loading && items.length === 0 && <p className={styles.empty}>{t('Keine Reservierungen gefunden.', 'Бронирования не найдены.')}</p>}
            {!loading && items.map((item) => <button key={item.id} type="button" onClick={() => setSelectedId(item.id)} className={`${styles.listItem}${item.id === selectedId ? ` ${styles.listItemActive}` : ''}`}>
              <span className={styles.itemTop}><strong>{item.firstName} {item.lastName}</strong><span className={`${styles.badge} ${styles[`badge${item.status}`]}`}>{t(...statusLabels[item.status])}</span></span>
              <span>{item.date.slice(0, 10)} · {item.time} · {item.guests} {t('Personen', 'гостей')}</span>
              <small>{item.email}</small>
            </button>)}
          </section>
          {selected ? <ReservationEditor key={`${selected.id}-${selected.updatedAt}`} item={selected} busy={busy} onAction={performAction} t={t} />
            : <div className={styles.editor}><p>{t('Wählen Sie eine Reservierung aus.', 'Выберите бронирование.')}</p></div>}
        </div>
      </main>
    </div>
  )
}
