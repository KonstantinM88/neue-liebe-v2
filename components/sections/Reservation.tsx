'use client'

import { useState, type FormEvent } from 'react'
import { useLang } from '@/context/LangContext'

interface ReservationProps {
  onToast: (msg: string) => void
}

export default function Reservation({ onToast }: ReservationProps) {
  const { t, lang } = useLang()
  const [loading, setLoading] = useState(false)
  const dateInputLang = lang === 'de' ? 'de-DE' : 'en-US'

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

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang }),
      })
      if (res.ok) {
        onToast(t('✓ Reservierung eingegangen – Wir melden uns!', '✓ Reservation received – We will be in touch!'))
        setForm({ firstName: '', lastName: '', email: '', phone: '', date: '', time: '19:00', guests: '4', occasion: 'DINNER', specialRequest: '' })
      } else {
        onToast(t('Fehler – bitte versuchen Sie es erneut.', 'Error – please try again.'))
      }
    } catch {
      onToast(t('Netzwerkfehler.', 'Network error.'))
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, name: string, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={form[name as keyof typeof form]}
        onChange={handle}
        placeholder={placeholder}
        lang={type === 'date' || type === 'time' ? dateInputLang : undefined}
        required={['firstName', 'lastName', 'email', 'date'].includes(name)}
      />
    </div>
  )

  return (
    <section id="reservation" className="reservation-section">
      <div className="reservation-shell">
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

          {/* Guests */}
          <div className="form-group">
            <label>{t('Anzahl Personen', 'Number of Guests')}</label>
            <select name="guests" value={form.guests} onChange={handle}>
              {['1','2','3','4','5','6','7','8'].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
              <option value="9+">{t('Mehr als 8', 'More than 8')}</option>
            </select>
          </div>

          {/* Occasion */}
          <div className="form-group">
            <label>{t('Anlass', 'Occasion')}</label>
            <select name="occasion" value={form.occasion} onChange={handle}>
              <option value="DINNER">{t('Dinner', 'Dinner')}</option>
              <option value="BIRTHDAY">{t('Geburtstag', 'Birthday')}</option>
              <option value="WEDDING">{t('Hochzeit', 'Wedding')}</option>
              <option value="CORPORATE">{t('Firmenfeier', 'Corporate Event')}</option>
            </select>
          </div>

          {/* Special request */}
          <div className="form-group full">
            <label>{t('Sonderwünsche', 'Special Requests')}</label>
            <textarea
              name="specialRequest"
              value={form.specialRequest}
              onChange={handle}
              placeholder="..."
            />
          </div>

          <button className="btn-submit" type="submit" disabled={loading}>
            {loading ? '...' : t('Reservierung bestätigen', 'Confirm Reservation')}
          </button>
        </form>
      </div>
    </section>
  )
}
