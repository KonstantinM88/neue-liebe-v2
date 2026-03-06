'use client'

import { useLang } from '@/context/LangContext'

export default function Hero() {
  const { t } = useLang()

  return (
    <section id="hero" style={{ position: 'relative', height: '100vh', minHeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-overlay-bottom" />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 2rem' }}>
        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '0.68rem',
          fontWeight: 300,
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          color: 'var(--gold)',
          marginBottom: '1.5rem',
          opacity: 0,
          animation: 'fadeUp 0.8s 1.2s forwards',
        }}>
          {t('Willkommen in', 'Welcome to')}
        </p>

        <h1 className="hero-title">
          Neue<em>Liebe</em>
        </h1>

        <p style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
          fontWeight: 300,
          letterSpacing: '0.4em',
          textTransform: 'uppercase',
          color: 'var(--gold-light)',
          marginBottom: '3.5rem',
          opacity: 0,
          animation: 'fadeUp 0.8s 1.6s forwards',
        }}>
          Restaurant &nbsp;•&nbsp; Terrasse &nbsp;•&nbsp; Tanz & Events
        </p>

        <div style={{
          width: 50, height: 1,
          background: 'linear-gradient(to right, transparent, var(--gold), transparent)',
          margin: '0 auto 2.5rem',
          opacity: 0,
          animation: 'fadeUp 0.8s 1.7s forwards',
        }} />

        <div style={{
          display: 'flex', gap: '1.2rem', flexWrap: 'wrap', justifyContent: 'center',
          opacity: 0, animation: 'fadeUp 0.8s 1.9s forwards',
        }}>
          <a href="#reservation" style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.7rem',
            fontWeight: 400,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--charcoal)',
            background: 'var(--gold)',
            border: '1px solid var(--gold)',
            padding: '15px 36px',
            textDecoration: 'none',
            transition: 'all 0.4s var(--transition)',
            display: 'inline-block',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'transparent'
            el.style.color = 'var(--gold)'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'var(--gold)'
            el.style.color = 'var(--charcoal)'
            el.style.transform = ''
          }}
          >
            {t('Tisch reservieren', 'Reserve a Table')}
          </a>
          <a href="#menu" style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.7rem',
            fontWeight: 400,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#fff',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.4)',
            padding: '15px 36px',
            textDecoration: 'none',
            transition: 'all 0.4s var(--transition)',
            display: 'inline-block',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.borderColor = 'var(--gold)'
            el.style.color = 'var(--gold)'
            el.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.borderColor = 'rgba(255,255,255,0.4)'
            el.style.color = '#fff'
            el.style.transform = ''
          }}
          >
            {t('Speisekarte ansehen', 'View Menu')}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '3rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 8, zIndex: 2,
        opacity: 0, animation: 'fadeUp 0.8s 2.2s forwards',
      }}>
        <span style={{
          fontSize: '0.58rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
          fontFamily: "'Jost', sans-serif",
        }}>
          {t('Entdecken', 'Discover')}
        </span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
