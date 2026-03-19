'use client'

import { useLang } from '@/context/LangContext'

const features = [
  {
    icon: 'wedding' as const,
    titleDe: 'Hochzeiten', titleEn: 'Weddings',
    descDe: 'Unvergessliche Momente für das schönste Fest Ihres Lebens.',
    descEn: 'Unforgettable moments for the most beautiful celebration of your life.',
  },
  {
    icon: 'corporate' as const,
    titleDe: 'Firmenfeiern', titleEn: 'Corporate Events',
    descDe: 'Professionelle Atmosphäre mit kulinarischem Genuss.',
    descEn: 'Professional atmosphere with culinary excellence.',
  },
  {
    icon: 'music' as const,
    titleDe: 'Tanzabende', titleEn: 'Dance Evenings',
    descDe: 'Live-Musik und Tanzfläche für magische Abende.',
    descEn: 'Live music and dance floor for magical evenings.',
  },
]

const eventCards = [
  {
    srcDesktop: '/hochzeit_restaurant_desktop_1600x1200.webp',
    srcMobile: '/hochzeit_restaurant_mobile_800x600.webp',
    titleDe: 'Hochzeiten',
    titleEn: 'Weddings',
  },
  {
    srcDesktop: '/firmen_1200.webp',
    srcMobile: '/firmen_800.webp',
    titleDe: 'Firmenveranstaltungen',
    titleEn: 'Corporate Events',
  },
  {
    srcDesktop: '/events3_1200.webp',
    srcMobile: '/events3_800.webp',
    titleDe: 'Tanz & Musik',
    titleEn: 'Dance & Music',
  },
]

function EventFeatureIcon({ type }: { type: 'wedding' | 'corporate' | 'music' }) {
  if (type === 'wedding') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="13" r="4.25" />
        <circle cx="15" cy="13" r="4.25" />
        <path d="M8 8.2 12 4.8l4 3.4" />
        <path d="M11.6 13h.8" />
      </svg>
    )
  }

  if (type === 'corporate') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="7" width="16" height="11" rx="2.5" />
        <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" />
        <path d="M4 11.5h16" />
        <path d="M11 11.5v1.6h2v-1.6" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 6v8.3a2.8 2.8 0 1 1-1.8-2.62" />
      <path d="M9 6 17 4v8.3a2.8 2.8 0 1 1-1.8-2.62" />
    </svg>
  )
}

export default function Events() {
  const { t } = useLang()

  return (
    <section id="events" className="events-section">
      <div className="events-container">

        {/* Top grid */}
        <div className="events-top">

          {/* Text */}
          <div className="reveal-left">
            <p className="section-label" style={{ color: 'var(--gold)' }}>
              {t('Feiern & Feste', 'Celebrations')}
            </p>
            <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--charcoal)' }}>
              {t('Ihre Feier –', 'Your Celebration –')}<br />
              <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>
                {t('unser Herzstück', 'our passion')}
              </em>
            </h2>
            <span className="gold-line" />
            <p style={{ fontSize: '1rem', lineHeight: 1.85, color: 'var(--brown-light)', fontWeight: 300, marginBottom: '1.5rem' }}>
              {t(
                'Von der intimen Geburtstagsfeier bis zur großen Hochzeit – wir verwandeln Ihre Wünsche in unvergessliche Momente. Unser erfahrenes Team kümmert sich um jedes Detail.',
                'From the intimate birthday celebration to the grand wedding – we transform your wishes into unforgettable moments. Our experienced team takes care of every detail.'
              )}
            </p>

            <div className="events-feature-list">
              {features.map((f) => (
                <div key={f.titleDe} className="events-feature-item">
                  <span className="events-feature-icon-shell" aria-hidden="true">
                    <span className="events-feature-icon">
                      <EventFeatureIcon type={f.icon} />
                    </span>
                  </span>

                  <div className="events-feature-copy">
                    <h4 className="events-feature-title">
                      {t(f.titleDe, f.titleEn)}
                    </h4>
                    <p className="events-feature-desc">
                      {t(f.descDe, f.descEn)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="events-visual reveal-right">
            <div className="events-visual-frame">
              <picture>
                <source media="(max-width: 768px)" srcSet="/events2_800.webp" />
                <img
                  src="/events2_1200.webp"
                  alt={t('Events Neue Liebe', 'Neue Liebe Events')}
                  className="events-visual-image"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>

            <div className="events-stat-badge">
              <div className="events-stat-kicker">
                {t('Besondere Anlässe', 'Special occasions')}
              </div>
              <div className="events-stat-value">200+</div>
              <div className="events-stat-label">
                {t('Erfolgreiche Events', 'Successful Events')}
              </div>
            </div>
          </div>
        </div>

        {/* Event cards */}
        <div className="events-grid reveal">
          {eventCards.map((card, index) => (
            <article key={card.titleDe} className="event-card">
              <picture className="event-card-media">
                <source media="(max-width: 768px)" srcSet={card.srcMobile} />
                <img
                  src={card.srcDesktop}
                  alt={t(card.titleDe, card.titleEn)}
                  className="event-card-image"
                  loading="lazy"
                />
              </picture>

              <div className="event-card-overlay">
                <div className="event-card-meta">
                  <span className="event-card-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="event-card-line" aria-hidden="true" />
                </div>

                <div className="event-card-title">
                  {t(card.titleDe, card.titleEn)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
