'use client'

import Image from 'next/image'
import { useLang } from '@/context/LangContext'

const images = [
  {
    src: '/banket.webp',
    altDe: 'Bankettsaal',
    altEn: 'Banquet hall',
    labelDe: 'Bankett',
    labelEn: 'Banquet',
    cls: 'g1',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
    altDe: 'Feine Küche',
    altEn: 'Fine dining',
    labelDe: 'Kulinarik',
    labelEn: 'Cuisine',
    cls: 'g2',
  },
  {
    src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80',
    altDe: 'Interieur',
    altEn: 'Interior',
    labelDe: 'Interior',
    labelEn: 'Interior',
    cls: 'g3',
  },
  {
    src: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80',
    altDe: 'Terrasse',
    altEn: 'Terrace',
    labelDe: 'Momente',
    labelEn: 'Moments',
    cls: 'g4',
  },
  {
    src: '/terrasse.webp',
    altDe: 'Terrasse am Abend',
    altEn: 'Terrace at night',
    labelDe: 'Terrasse',
    labelEn: 'Terrace',
    cls: 'g5',
  },
  {
    src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80',
    altDe: 'Events',
    altEn: 'Events',
    labelDe: 'Events',
    labelEn: 'Events',
    cls: 'g6',
  },
]

export default function Gallery() {
  const { t } = useLang()

  return (
    <section id="gallery" className="gallery-section">
      <div className="section-header-center gallery-header reveal">
        <p className="section-label" style={{ color: 'var(--gold)' }}>
          {t('Einblicke', 'Gallery')}
        </p>
        <h2 className="section-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: '#fff' }}>
          {t('Momente & Atmosphäre', 'Moments & Atmosphere')}
        </h2>
      </div>

      <div className="gallery-shell reveal">
        <div className="gallery-grid">
          {images.map((img, index) => (
            <article key={img.cls} className={`gallery-item ${img.cls}`}>
              <Image
                src={img.src}
                alt={t(img.altDe, img.altEn)}
                fill
                priority={img.cls === 'g1'}
                sizes={
                  img.cls === 'g1'
                    ? '(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1100px) 100vw, 66vw'
                    : '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1100px) 50vw, 33vw'
                }
                style={{
                  objectFit: 'cover',
                  objectPosition:
                    img.cls === 'g1'
                      ? 'center 52%'
                      : img.cls === 'g5'
                        ? 'center 56%'
                        : 'center center',
                }}
              />

              <div className="gallery-item-overlay" aria-hidden="true">
                <span className="gallery-item-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="gallery-item-label">{t(img.labelDe, img.labelEn)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
