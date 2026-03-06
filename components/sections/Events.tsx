'use client'

import Image from 'next/image'
import { useLang } from '@/context/LangContext'

const features = [
  {
    icon: '💒',
    titleDe: 'Hochzeiten', titleEn: 'Weddings',
    descDe: 'Unvergessliche Momente für das schönste Fest Ihres Lebens.',
    descEn: 'Unforgettable moments for the most beautiful celebration of your life.',
  },
  {
    icon: '🥂',
    titleDe: 'Firmenfeiern', titleEn: 'Corporate Events',
    descDe: 'Professionelle Atmosphäre mit kulinarischem Genuss.',
    descEn: 'Professional atmosphere with culinary excellence.',
  },
  {
    icon: '🎶',
    titleDe: 'Tanzabende', titleEn: 'Dance Evenings',
    descDe: 'Live-Musik und Tanzfläche für magische Abende.',
    descEn: 'Live music and dance floor for magical evenings.',
  },
]

const eventCards = [
  { src: 'https://images.unsplash.com/photo-1525268323446-0505b6fe7778?w=800&q=80', titleDe: 'Hochzeiten',            titleEn: 'Weddings' },
  { src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', titleDe: 'Firmenveranstaltungen', titleEn: 'Corporate Events' },
  { src: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80', titleDe: 'Tanz & Musik',          titleEn: 'Dance & Music' },
]

export default function Events() {
  const { t } = useLang()

  return (
    <section id="events" style={{ background: 'var(--cream)', padding: 'clamp(5rem, 10vw, 10rem) 4vw' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Top grid */}
        <div className="events-top" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start', marginBottom: '5rem' }}>

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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {features.map((f) => (
                <div key={f.titleDe} style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                  <div style={{
                    width: 44, height: 44, flexShrink: 0,
                    border: '1px solid var(--gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', color: 'var(--gold)',
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', fontWeight: 400, color: 'var(--charcoal)', marginBottom: '0.3rem' }}>
                      {t(f.titleDe, f.titleEn)}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--brown-light)' }}>
                      {t(f.descDe, f.descEn)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="reveal-right" style={{ position: 'relative' }}>
            <Image
              src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80"
              alt={t('Events Neue Liebe', 'Neue Liebe Events')}
              width={600}
              height={750}
              style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: '-2rem', left: '-2rem',
              background: 'var(--gold)',
              padding: '2rem',
              maxWidth: 240,
            }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3.5rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1 }}>200+</div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--charcoal)', fontWeight: 400, marginTop: '0.3rem' }}>
                {t('Erfolgreiche Events', 'Successful Events')}
              </div>
            </div>
          </div>
        </div>

        {/* Event cards */}
        <div className="events-grid reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
          {eventCards.map((card) => (
            <div key={card.titleDe} className="event-card" style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/2', cursor: 'none' }}>
              <Image
                src={card.src}
                alt={t(card.titleDe, card.titleEn)}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover', transition: 'transform 0.8s var(--transition)' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(26,23,20,0.88) 0%, transparent 60%)',
                display: 'flex', alignItems: 'flex-end',
                padding: '2rem',
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', fontWeight: 400, color: '#fff' }}>
                  {t(card.titleDe, card.titleEn)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
