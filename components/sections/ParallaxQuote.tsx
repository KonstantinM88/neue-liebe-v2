'use client'

import { useLang } from '@/context/LangContext'

export default function ParallaxQuote() {
  const { t } = useLang()

  return (
    <section style={{ position: 'relative', height: '60vh', minHeight: 400, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background */}
      <div style={{
        position: 'absolute',
        inset: '-15%',
        backgroundImage: "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }} />
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,23,20,0.72)' }} />

      {/* Content */}
      <div className="reveal" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 4vw', maxWidth: 900 }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: '#fff',
          lineHeight: 1.4,
          marginBottom: '1.5rem',
        }}>
          {t('„Gutes Essen ist die ', '"Good food is the ')}
          <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>
            {t('Grundlage', 'foundation')}
          </em>
          {t(' für ein wahrhaft glückliches Leben."', ' of genuine happiness."')}
        </p>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 300 }}>
          — Auguste Escoffier
        </p>
      </div>
    </section>
  )
}
