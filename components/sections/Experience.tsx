'use client'

import type { CSSProperties } from 'react'
import { useLang } from '@/context/LangContext'

const cards = [
  {
    num: '01',
    video: '/terasse-video.webm',
    poster: '/terrasse.webp',
    altDe: 'Sommeterrasse',
    altEn: 'Summer Terrace',
    titleDe: 'Sommterrasse',
    titleEn: 'Summer Terrace',
    descDe: 'Genießen Sie laue Abende unter dem Sternenhimmel auf unserer romantischen Terrasse mit Blick ins Grüne.',
    descEn: 'Enjoy balmy evenings under starlit skies on our romantic terrace with views of lush greenery.',
    delay: 0,
  },
  {
    num: '02',
    video: '/bankettsaal-video.webm',
    poster: '/banket.webp',
    altDe: 'Bankettsaal',
    altEn: 'Banquet Hall',
    titleDe: 'Bankettsaal',
    titleEn: 'Banquet Hall',
    descDe: 'Unser eleganter Bankettsaal bietet den perfekten Rahmen für Hochzeiten, Firmenfeiern und besondere Anlässe.',
    descEn: 'Our elegant banquet hall provides the perfect setting for weddings, corporate events and special occasions.',
    delay: 0.15,
  },
  {
    num: '03',
    video: '/Evets-video.mp4',
    poster: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80',
    altDe: 'Tanz und Events',
    altEn: 'Dance and Events',
    titleDe: 'Tanz & Events',
    titleEn: 'Dance & Events',
    descDe: 'Live-Musik, Themenabende und unvergessliche Tanzveranstaltungen – bei uns ist immer etwas los.',
    descEn: 'Live music, themed evenings and unforgettable dance events – there is always something happening here.',
    delay: 0.3,
  },
]

export default function Experience() {
  const { t } = useLang()

  return (
    <section id="experience" style={{ background: 'var(--charcoal)', padding: 'clamp(5rem, 10vw, 10rem) 4vw' }}>
      {/* Header */}
      <div className="section-header-center reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 5rem' }}>
        <p className="section-label" style={{ color: 'var(--gold)' }}>
          {t('Unsere Welten', 'Our Worlds')}
        </p>
        <h2 className="section-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: '#fff' }}>
          {t('Drei einzigartige Erlebnisse', 'Three Unique Experiences')}
        </h2>
      </div>

      {/* Grid */}
      <div className="experience-grid">
        {cards.map((c) => (
          <div
            key={c.num}
            className="exp-card reveal"
            style={{ '--exp-delay': `${c.delay}s` } as CSSProperties}
          >
            <video
              className="exp-media"
              src={c.video}
              aria-label={t(c.altDe, c.altEn)}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={c.poster}
            />
            <div className="exp-overlay">
              <div className="exp-num">{c.num}</div>
              <div className="exp-line" />
              <div className="exp-title">{t(c.titleDe, c.titleEn)}</div>
              <p className="exp-desc">{t(c.descDe, c.descEn)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
