'use client'

import Image from 'next/image'
import { useLang } from '@/context/LangContext'

const images = [
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80', alt: 'Restaurant Atmosphäre', cls: 'g1' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',  alt: 'Feine Küche', cls: 'g2' },
  { src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&q=80',  alt: 'Interieur', cls: 'g3' },
  { src: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&q=80',  alt: 'Terrasse', cls: 'g4' },
  { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',     alt: 'Fleischgericht', cls: 'g5' },
  { src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80',  alt: 'Events', cls: 'g6' },
]

export default function Gallery() {
  const { t } = useLang()

  return (
    <section id="gallery" style={{ background: 'var(--charcoal)', padding: 'clamp(5rem, 10vw, 10rem) 4vw' }}>
      <div className="section-header-center reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 4rem' }}>
        <p className="section-label" style={{ color: 'var(--gold)' }}>
          {t('Einblicke', 'Gallery')}
        </p>
        <h2 className="section-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: '#fff' }}>
          {t('Momente & Atmosphäre', 'Moments & Atmosphere')}
        </h2>
      </div>

      <div className="gallery-grid reveal">
        {images.map((img) => (
          <div key={img.cls} className={`gallery-item ${img.cls}`}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
