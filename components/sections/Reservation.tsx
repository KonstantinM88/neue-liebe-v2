'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import { useLang } from '@/context/LangContext'
import { berlinDateTimeParts, isWithinOpeningHours, lastBookingTime, openingHoursForDate } from '@/lib/reservation-datetime'

interface ReservationProps {
  onToast: (msg: string) => void
}

export default function Reservation({ onToast }: ReservationProps) {
  const { t, lang } = useLang()
  const [loading, setLoading] = useState(false)
  const [earliest, setEarliest] = useState({ date: '', time: '' })
  const shellRef = useRef<HTMLDivElement>(null)
  const dateInputLang = lang === 'de' ? 'de-DE' : 'en-US'

  // Trigger gold shimmer wave when section scrolls into view
  useEffect(() => {
    const el = shellRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reservation-shell--wave-active')
        } else {
          el.classList.remove('reservation-shell--wave-active')
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updateEarliest = () => setEarliest(berlinDateTimeParts(new Date(Date.now() + 60_000)))
    updateEarliest()
    const timer = window.setInterval(updateEarliest, 30_000)
    return () => window.clearInterval(timer)
  }, [])


  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: '4',
    occasion: 'DINNER',
    specialRequest: '',
  })
  const openingHours = openingHoursForDate(form.date)

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => {
      if (name === 'date') {
        const hours = openingHoursForDate(value)
        const time = hours && (prev.time < hours.opens || prev.time >= hours.closes) ? hours.opens : prev.time
        return { ...prev, date: value, time }
      }
      return { ...prev, [name]: value }
    })
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const now = berlinDateTimeParts()
    if (form.date < now.date || (form.date === now.date && form.time <= now.time)) {
      onToast(t('Bitte wählen Sie ein zukünftiges Datum und eine zukünftige Uhrzeit.', 'Please choose a future date and time.'))
      return
    }
    if (!isWithinOpeningHours(form.date, form.time)) {
      onToast(t('Bitte wählen Sie einen Termin innerhalb unserer Öffnungszeiten.', 'Please choose a time during our opening hours.'))
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang }),
      })
      if (res.ok) {
        const result = await res.json()
        if (result.notification !== 'sent') {
          onToast(t(
            'Anfrage gespeichert, aber unser Team wurde nicht per E-Mail benachrichtigt. Bitte rufen Sie uns an: 034461 599804.',
            'Request saved, but our team was not notified by email. Please call us: +49 34461 599804.'
          ))
        } else if (result.guestNotification !== 'sent') {
          onToast(t(
            'Anfrage gespeichert, aber die Eingangs-E-Mail konnte nicht versendet werden. Bitte prüfen Sie Ihre E-Mail-Adresse oder rufen Sie uns an.',
            'Request saved, but we could not send the receipt email. Please check your email address or call us.'
          ))
        } else {
          onToast(t(
            'Anfrage eingegangen. Die E-Mail ist unterwegs; Ihr Tisch ist noch nicht bestätigt.',
            'Request received. The email is on its way; your table is not confirmed yet.'
          ))
        }
        setForm({ firstName: '', lastName: '', email: '', phone: '', date: '', time: '19:00', guests: '4', occasion: 'DINNER', specialRequest: '' })
      } else {
        const error = (await res.json().catch(() => ({}))) as { error?: string }
        onToast(error.error === 'past_reservation'
          ? t('Bitte wählen Sie ein zukünftiges Datum und eine zukünftige Uhrzeit.', 'Please choose a future date and time.')
          : error.error === 'outside_opening_hours'
            ? t('Bitte wählen Sie einen Termin innerhalb unserer Öffnungszeiten.', 'Please choose a time during our opening hours.')
          : t('Fehler – bitte versuchen Sie es erneut.', 'Error – please try again.'))
      }
    } catch {
      onToast(t('Netzwerkfehler.', 'Network error.'))
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, name: string, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label htmlFor={`reservation-${name}`}>{label}</label>
      <input
        id={`reservation-${name}`}
        type={type}
        name={name}
        value={form[name as keyof typeof form]}
        onChange={handle}
        placeholder={placeholder}
        lang={type === 'date' || type === 'time' ? dateInputLang : undefined}
        min={type === 'date' ? earliest.date : type === 'time'
          ? form.date === earliest.date && openingHours
            ? (earliest.time > openingHours.opens ? earliest.time : openingHours.opens)
            : openingHours?.opens
          : undefined}
        max={type === 'time' && openingHours ? lastBookingTime(openingHours.closes) : undefined}
        autoComplete={
          name === 'firstName'
            ? 'given-name'
            : name === 'lastName'
              ? 'family-name'
              : name === 'email'
                ? 'email'
                : name === 'phone'
                  ? 'tel'
                  : undefined
        }
        required={['firstName', 'lastName', 'email', 'date'].includes(name)}
      />
    </div>
  )

  return (
    <section id="reservation" className="reservation-section">
      <div
        ref={shellRef}
        className="reservation-shell"
      >
        <p className="section-label reveal" style={{ color: 'var(--gold)' }}>
          {t('Ihren Platz sichern', 'Secure Your Seat')}
        </p>
        <h2 className="section-title reveal" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: '#fff' }}>
          {t('Tisch reservieren', 'Reserve a Table')}
        </h2>
        <p className="reservation-lead reveal">
          {t(
            'Wir freuen uns auf Ihren Besuch. Reservieren Sie jetzt Ihren Tisch und erleben Sie die Neue Liebe hautnah.',
            'We look forward to your visit. Reserve your table now and experience Neue Liebe first-hand.'
          )}
        </p>

        <form className="res-form reservation-form reveal" onSubmit={onSubmit}>
          {field(t('Vorname', 'First Name'),  'firstName', 'text', 'Maria')}
          {field(t('Nachname', 'Last Name'),   'lastName',  'text', 'Müller')}
          {field(t('E-Mail', 'Email'),          'email',     'email', 'maria@beispiel.de')}
          {field(t('Telefon', 'Phone'),         'phone',     'tel',   '+49 ...')}
          {field(t('Datum', 'Date'),            'date',      'date', lang === 'de' ? 'TT.MM.JJJJ' : 'MM/DD/YYYY')}
          {field(t('Uhrzeit', 'Time'),          'time',      'time')}
          <p className="form-group full" role="status" style={{ color: 'var(--gold-light)', fontSize: '0.85rem' }}>
            {form.date && !openingHours
              ? t('Montag und Dienstag ist das Restaurant geschlossen.', 'The restaurant is closed on Monday and Tuesday.')
              : t('Öffnungszeiten: Mi–Sa 15:00–23:00, So 10:00–16:00.', 'Opening hours: Wed–Sat 15:00–23:00, Sun 10:00–16:00.')}
          </p>

          {/* Guests */}
          <div className="form-group">
            <label htmlFor="reservation-guests">{t('Anzahl Personen', 'Number of Guests')}</label>
            <select id="reservation-guests" name="guests" value={form.guests} onChange={handle}>
              {['1','2','3','4','5','6','7','8'].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option value="9+">{t('Mehr als 8', 'More than 8')}</option>
            </select>
          </div>

          {/* Occasion */}
          <div className="form-group">
            <label htmlFor="reservation-occasion">{t('Anlass', 'Occasion')}</label>
            <select id="reservation-occasion" name="occasion" value={form.occasion} onChange={handle}>
              <option value="DINNER">{t('Dinner', 'Dinner')}</option>
              <option value="BIRTHDAY">{t('Geburtstag', 'Birthday')}</option>
              <option value="WEDDING">{t('Hochzeit', 'Wedding')}</option>
              <option value="CORPORATE">{t('Firmenfeier', 'Corporate Event')}</option>
            </select>
          </div>

          {/* Special request */}
          <div className="form-group full">
            <label htmlFor="reservation-specialRequest">{t('Sonderwünsche', 'Special Requests')}</label>
            <textarea
              id="reservation-specialRequest"
              name="specialRequest"
              value={form.specialRequest}
              onChange={handle}
              placeholder="..."
            />
          </div>

          <button className="btn-submit" type="submit" disabled={loading || (Boolean(form.date) && !openingHours)}>
            {loading ? '...' : t('Tisch anfragen', 'Request a Table')}
          </button>
        </form>
      </div>
    </section>
  )
}
