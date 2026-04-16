'use client'

import { useLang } from '@/context/LangContext'

function ContactIcon({ type }: { type: 'location' | 'phone' | 'hours' | 'price' }) {
  if (type === 'location') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 21s-6-4.8-6-10a6 6 0 1 1 12 0c0 5.2-6 10-6 10Z" />
        <circle cx="12" cy="11" r="2.2" />
      </svg>
    )
  }

  if (type === 'phone') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8.2 5.5c.4-1 1.5-1.4 2.4-1l1.5.7c.9.4 1.3 1.4 1 2.3l-.5 1.5a1.5 1.5 0 0 0 .3 1.4l1.8 1.8a1.5 1.5 0 0 0 1.4.3l1.5-.5c.9-.3 1.9.1 2.3 1l.7 1.5c.4.9 0 2-.9 2.4l-1 .4c-1.7.7-3.7.5-5.3-.5a22.1 22.1 0 0 1-4.9-4.1 22.1 22.1 0 0 1-4.1-4.9c-1-1.6-1.2-3.6-.5-5.3l.4-1Z" />
      </svg>
    )
  }

  if (type === 'hours') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 7.8v4.6l3 1.8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 8.5c0-1.4 1.1-2.5 2.5-2.5h5a2.5 2.5 0 1 1 0 5h-4a2.5 2.5 0 1 0 0 5h5c1.4 0 2.5-1.1 2.5-2.5" />
      <path d="M9.2 8h6.1" />
      <path d="M8.7 16h6.6" />
    </svg>
  )
}

export default function Contact() {
  const { t } = useLang()

  const items = [
    {
      icon: 'location' as const,
      titleDe: 'Adresse', titleEn: 'Address',
      content: <p>Wetzendorfer Str. 10<br />06642 Nebra (Unstrut)<br />Deutschland</p>,
    },
    {
      icon: 'phone' as const,
      titleDe: 'Telefon', titleEn: 'Phone',
      content: <a href="tel:034461599804" className="contact-link">034461 599804</a>,
    },
    {
      icon: 'hours' as const,
      titleDe: 'Öffnungszeiten', titleEn: 'Opening Hours',
      content: <p>{t('Täglich geöffnet', 'Open daily')}<br />{t('Schließt um 23:00 Uhr', 'Closes at 23:00')}</p>,
    },
    {
      icon: 'price' as const,
      titleDe: 'Durchschnittspreis', titleEn: 'Average Price',
      content: <p>20–30 € {t('pro Person', 'per person')}</p>,
    },
  ]

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <div className="contact-info reveal-left">
          <p className="section-label" style={{ color: 'var(--gold)' }}>
            {t('So finden Sie uns', 'Find Us')}
          </p>
          <h2 className="section-title contact-title" style={{ color: 'var(--charcoal)' }}>
            {t('Besuchen Sie', 'Visit')}<br />
            {t('die Neue Liebe', 'Neue Liebe')}
          </h2>
          <span className="gold-line" />

          <div className="contact-list">
            {items.map((item) => (
              <div key={item.titleDe} className="contact-card">
                <span className="contact-card-icon-shell" aria-hidden="true">
                  <span className="contact-card-icon">
                    <ContactIcon type={item.icon} />
                  </span>
                </span>

                <div className="contact-card-copy">
                  <h3 className="contact-card-title">
                    {t(item.titleDe, item.titleEn)}
                  </h3>
                  <div className="contact-card-content">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="contact-map-shell reveal-right">
          <div className="contact-map-frame">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2503.8!2d11.8365!3d51.3505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a681b0b3abcdef%3A0x123456789abcdef!2sWetzendorfer+Str.+10%2C+06642+Nebra+(Unstrut)!5e0!3m2!1sde!2sde!4v1234567890"
              className="contact-map"
              allowFullScreen
              loading="lazy"
              title="Neue Liebe Restaurant Standort"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
