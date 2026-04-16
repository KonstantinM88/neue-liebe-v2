'use client'

import Image from 'next/image'
import { useLang } from '@/context/LangContext'
import LazyVideo from '@/components/LazyVideo'

type GalleryItem = {
  src: string
  srcMobile?: string
  altDe: string
  altEn: string
  labelDe: string
  labelEn: string
  cls: 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6'
}

const images: GalleryItem[] = [
  {
    src: '/banket.webp',
    altDe: 'Bankettsaal',
    altEn: 'Banquet hall',
    labelDe: 'Bankett',
    labelEn: 'Banquet',
    cls: 'g1',
  },
  {
    src: '/kulinarik_1600.webp',
    srcMobile: '/kulinarik_1200.webp',
    altDe: 'Feine Küche',
    altEn: 'Fine dining',
    labelDe: 'Kulinarik',
    labelEn: 'Cuisine',
    cls: 'g2',
  },
  {
    src: '/german_food2_1200.webp',
    srcMobile: '/german_food2_800.webp',
    altDe: 'Interieur',
    altEn: 'Interior',
    labelDe: 'Interior',
    labelEn: 'Interior',
    cls: 'g3',
  },
  {
    src: '/momente_1200.webp',
    srcMobile: '/momente_800.webp',
    altDe: 'Terrasse',
    altEn: 'Terrace',
    labelDe: 'Momente',
    labelEn: 'Moments',
    cls: 'g4',
  },
  {
    src: '/terasse-video.webm',
    altDe: 'Terrasse am Abend',
    altEn: 'Terrace at night',
    labelDe: 'Terrasse',
    labelEn: 'Terrace',
    cls: 'g5',
  },
  {
    src: '/events_1200.webp',
    srcMobile: '/events_800.webp',
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
          {images.map((img, index) => {
            const isTerraceVideo = img.cls === 'g5'
            const hasMobileSource = Boolean(img.srcMobile)

            return (
              <article key={img.cls} className={`gallery-item ${img.cls}`}>
                {isTerraceVideo ? (
                  <LazyVideo
                    src={img.src}
                    aria-label={t(img.altDe, img.altEn)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/terrasse.webp"
                    rootMargin="320px 0px"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center 56%',
                    }}
                  />
                ) : hasMobileSource ? (
                  <picture>
                    <source media="(max-width: 768px)" srcSet={img.srcMobile} />
                    <img
                      src={img.src}
                      alt={t(img.altDe, img.altEn)}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                ) : (
                  <Image
                    src={img.src}
                    alt={t(img.altDe, img.altEn)}
                    fill
                    sizes={
                      img.cls === 'g1'
                        ? '(max-width: 480px) 100vw, (max-width: 768px) 100vw, (max-width: 1100px) 100vw, 66vw'
                        : '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1100px) 50vw, 33vw'
                    }
                    style={{
                      objectFit: 'cover',
                      objectPosition: img.cls === 'g1' ? 'center 52%' : 'center center',
                    }}
                  />
                )}

                <div className="gallery-item-overlay" aria-hidden="true">
                  <span className="gallery-item-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="gallery-item-label">{t(img.labelDe, img.labelEn)}</span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
