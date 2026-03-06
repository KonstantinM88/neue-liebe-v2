'use client'

import Image from 'next/image'
import { useLang } from '@/context/LangContext'

const cards = [
  {
    num: '01',
    img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
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
    img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80',
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
    img: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80',
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
      <div className="experience-grid" style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2px',
      }}>
        {cards.map((c) => (
          <div
            key={c.num}
            className="exp-card reveal"
            style={{
              position: 'relative',
              overflow: 'hidden',
              aspectRatio: '3/4',
              cursor: 'none',
              transitionDelay: `${c.delay}s`,
            }}
          >
            <Image
              src={c.img}
              alt={t(c.altDe, c.altEn)}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover', transition: 'transform 0.8s var(--transition)' }}
            />
            <div className="exp-overlay" style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(26,23,20,0.92) 0%, rgba(26,23,20,0.2) 50%, transparent 100%)',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              padding: '2.5rem',
            }}>
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
