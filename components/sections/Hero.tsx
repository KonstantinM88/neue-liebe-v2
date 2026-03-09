'use client'

import { useLang } from '@/context/LangContext'

export default function Hero() {
  const { t } = useLang()

  return (
    <section id="hero" className="hero-section">
      <div className="hero-bg" aria-hidden="true">
        <picture className="hero-bg-picture">
          <img
            className="hero-bg-image"
            src="/cafe_interior_1920x1440_optimized.webp"
            srcSet={[
              '/cafe_interior_800x600_optimized.webp 800w',
              '/cafe_interior_1600x1200_optimized.webp 1600w',
              '/cafe_interior_1920x1440_optimized.webp 1920w',
            ].join(', ')}
            sizes="(max-width: 640px) 180vw, (max-width: 1024px) 135vw, (max-width: 1600px) 100vw, 1920px"
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </div>
      <div className="hero-overlay" />
      <div className="hero-overlay-bottom" />

      {/* Content */}
      <div className="hero-content">
        <p className="hero-eyebrow">
          {t('Willkommen in', 'Welcome to')}
        </p>

        <h1 className="hero-title">
          Neue<em>Liebe</em>
        </h1>

        <p className="hero-subtitle">
          <span>{t('Restaurant', 'Restaurant')}</span>
          <span className="hero-subtitle-separator" aria-hidden="true">•</span>
          <span>{t('Terrasse', 'Terrace')}</span>
          <span className="hero-subtitle-separator" aria-hidden="true">•</span>
          <span>{t('Tanz & Events', 'Dance & Events')}</span>
        </p>

        <div className="hero-divider" />

        <div className="hero-actions">
          <a href="#reservation" className="hero-btn hero-btn-primary">
            {t('Tisch reservieren', 'Reserve a Table')}
          </a>
          <a href="#menu" className="hero-btn hero-btn-secondary">
            {t('Speisekarte ansehen', 'View Menu')}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll">
        <span className="hero-scroll-label">
          {t('Entdecken', 'Discover')}
        </span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
