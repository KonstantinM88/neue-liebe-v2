'use client'

import Image from 'next/image'
import { useLang } from '@/context/LangContext'

export default function About() {
  const { t } = useLang()

  const stats = [
    { num: '15+', label: t('Jahre Erfahrung', 'Years Experience') },
    { num: '200+', label: t('Plätze', 'Seats') },
    { num: '4.8', label: t('Google Bewertung', 'Google Rating') },
    { num: '∞', label: t('Leidenschaft', 'Passion') },
  ]

  return (
    <section id="about" style={{ background: 'var(--cream)', padding: 'clamp(5rem, 10vw, 10rem) 4vw' }}>
      <div className="about-grid">
        {/* Text */}
        <div className="about-text reveal-left">
          <p className="section-label" style={{ color: 'var(--gold)' }}>
            {t('Unsere Geschichte', 'Our Story')}
          </p>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--charcoal)' }}>
            {t('Wo jede', 'Where every')}<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>
              {t('Mahlzeit', 'Meal')}
            </em><br />
            {t('eine Geschichte erzählt', 'tells a Story')}
          </h2>
          <span className="gold-line" />
          <p style={{ fontSize: '1rem', lineHeight: 1.85, color: 'var(--brown-light)', fontWeight: 300, marginBottom: '1.5rem' }}>
            {t(
              'Im Herzen von Nebra (Unstrut) gelegen, ist die Neue Liebe mehr als ein Restaurant – es ist ein Ort, an dem Leidenschaft, Genuss und Herzlichkeit zusammenkommen. Unsere Küche vereint regionale Aromen mit modernen kulinarischen Akzenten.',
              'Located in the heart of Nebra (Unstrut), Neue Liebe is more than a restaurant – it is a place where passion, pleasure and warmth come together. Our cuisine unites regional flavors with modern culinary accents.'
            )}
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.85, color: 'var(--brown-light)', fontWeight: 300, marginBottom: '1.5rem' }}>
            {t(
              'Ob ein romantisches Abendessen zu zweit, ein festliches Familienfest oder ein unvergesslicher Abend auf unserer Sommeterrasse – bei uns werden Momente zu Erinnerungen.',
              'Whether a romantic dinner for two, a festive family celebration, or an unforgettable evening on our summer terrace – with us, moments become memories.'
            )}
          </p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
            {stats.map((s) => (
              <div key={s.label} style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '1.2rem' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1 }}>
                  {s.num}
                </div>
                <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: '0.3rem', fontWeight: 300 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="about-visual reveal-right" style={{ position: 'relative' }}>
          <Image
            className="about-main-image"
            src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=85"
            alt={t('Restaurant Neue Liebe Interieur', 'Restaurant Neue Liebe interior')}
            width={600}
            height={800}
            style={{ width: '100%', height: 'auto', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
          />
          <Image
            className="about-img-float"
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=85"
            alt={t('Kulinarische Erlebnisse', 'Culinary experiences')}
            width={300}
            height={300}
            style={{
              position: 'absolute', bottom: '-2.5rem', left: '-2.5rem',
              width: '55%', aspectRatio: '1', objectFit: 'cover',
              border: '5px solid var(--cream)',
            }}
          />
          {/* Badge */}
          <div className="about-badge" style={{
            position: 'absolute', top: '2rem', right: '-1rem',
            width: 100, height: 100,
            background: 'var(--gold)',
            borderRadius: '50%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Cormorant Garamond', serif",
            boxShadow: '0 8px 30px rgba(201,169,110,0.4)',
          }}>
            <span style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1 }}>★</span>
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--charcoal)', fontFamily: "'Jost', sans-serif", fontWeight: 400 }}>Premium</span>
          </div>
        </div>
      </div>
    </section>
  )
}
