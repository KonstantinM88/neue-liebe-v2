'use client'

import { useLang } from '@/context/LangContext'

export default function Contact() {
  const { t } = useLang()

  const items = [
    {
      icon: '📍',
      titleDe: 'Adresse', titleEn: 'Address',
      content: <p>Wetzendorfer Str. 10<br />06642 Nebra (Unstrut)<br />Deutschland</p>,
    },
    {
      icon: '📞',
      titleDe: 'Telefon', titleEn: 'Phone',
      content: <a href="tel:034461599804" style={{ color: 'var(--brown-light)', textDecoration: 'none' }}>034461 599804</a>,
    },
    {
      icon: '🕐',
      titleDe: 'Öffnungszeiten', titleEn: 'Opening Hours',
      content: <p>{t('Täglich geöffnet', 'Open daily')}<br />{t('Schließt um 23:00 Uhr', 'Closes at 23:00')}</p>,
    },
    {
      icon: '💶',
      titleDe: 'Durchschnittspreis', titleEn: 'Average Price',
      content: <p>20–30 € {t('pro Person', 'per person')}</p>,
    },
  ]

  return (
    <section id="contact" style={{ background: 'var(--cream)', padding: 'clamp(5rem, 10vw, 10rem) 4vw' }}>
      <div className="contact-container" style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr 1.5fr',
        gap: '6rem', alignItems: 'start',
      }}>
        {/* Info */}
        <div className="reveal-left">
          <p className="section-label" style={{ color: 'var(--gold)' }}>
            {t('So finden Sie uns', 'Find Us')}
          </p>
          <h2 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--charcoal)' }}>
            {t('Besuchen Sie', 'Visit')}<br />
            {t('die Neue Liebe', 'Neue Liebe')}
          </h2>
          <span className="gold-line" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '3rem' }}>
            {items.map((item) => (
              <div key={item.titleDe} style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 46, height: 46, flexShrink: 0,
                  background: 'var(--gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', color: 'var(--charcoal)',
                }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.3rem', letterSpacing: '0.05em' }}>
                    {t(item.titleDe, item.titleEn)}
                  </h4>
                  <div style={{ fontSize: '0.9rem', color: 'var(--brown-light)', fontWeight: 300, lineHeight: 1.6 }}>
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="reveal-right" style={{ overflow: 'hidden' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2503.8!2d11.8365!3d51.3505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a681b0b3abcdef%3A0x123456789abcdef!2sWetzendorfer+Str.+10%2C+06642+Nebra+(Unstrut)!5e0!3m2!1sde!2sde!4v1234567890"
            width="100%"
            height="420"
            style={{ display: 'block', filter: 'grayscale(0.2) sepia(0.1)', border: 'none' }}
            allowFullScreen
            loading="lazy"
            title="Neue Liebe Restaurant Standort"
          />
        </div>
      </div>
    </section>
  )
}
