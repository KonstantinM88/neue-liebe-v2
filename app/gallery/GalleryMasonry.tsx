'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type TouchEvent as ReactTouchEvent } from 'react'
import type { GalleryPhoto } from '@/lib/gallery-types'
import styles from './gallery.module.css'

const ratioClass: Record<GalleryPhoto['ratio'], string> = {
  wide: styles.ratioWide,
  tall: styles.ratioTall,
  square: styles.ratioSquare,
}

type GalleryMasonryProps = {
  photos: GalleryPhoto[]
  labels?: {
    openPhotoPrefix: string
    previousPhoto: string
    nextPhoto: string
    closeLightbox: string
  }
}

type NaturalSize = {
  width: number
  height: number
}

const DEFAULT_LABELS = {
  openPhotoPrefix: 'Foto',
  previousPhoto: 'Vorheriges Foto',
  nextPhoto: 'Nächstes Foto',
  closeLightbox: 'Schließen',
}

export default function GalleryMasonry({ photos, labels = DEFAULT_LABELS }: GalleryMasonryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [naturalSize, setNaturalSize] = useState<NaturalSize | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const activePhoto = activeIndex === null ? null : photos[activeIndex]
  const activePosition = activeIndex === null ? 1 : activeIndex + 1

  const openPhoto = useCallback((index: number) => {
    setNaturalSize(null)
    setActiveIndex(index)
  }, [])

  const closePhoto = useCallback(() => {
    setActiveIndex(null)
    setNaturalSize(null)
  }, [])

  const showPrev = useCallback(() => {
    setNaturalSize(null)
    setActiveIndex((current) => {
      if (current === null || photos.length === 0) return current
      return (current - 1 + photos.length) % photos.length
    })
  }, [photos.length])

  const showNext = useCallback(() => {
    setNaturalSize(null)
    setActiveIndex((current) => {
      if (current === null || photos.length === 0) return current
      return (current + 1) % photos.length
    })
  }, [photos.length])

  useEffect(() => {
    if (activeIndex === null) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closePhoto()
      } else if (event.key === 'ArrowLeft') {
        showPrev()
      } else if (event.key === 'ArrowRight') {
        showNext()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [activeIndex, closePhoto, showNext, showPrev])

  const handleLightboxTouchStart = useCallback((event: ReactTouchEvent<HTMLElement>) => {
    if (event.touches.length !== 1) {
      touchStartRef.current = null
      return
    }

    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleLightboxTouchEnd = useCallback((event: ReactTouchEvent<HTMLElement>) => {
    if (!touchStartRef.current || event.changedTouches.length !== 1) {
      touchStartRef.current = null
      return
    }

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y

    touchStartRef.current = null

    const horizontalThreshold = 46
    const isHorizontalSwipe = Math.abs(deltaX) >= horizontalThreshold && Math.abs(deltaX) > Math.abs(deltaY) * 1.2

    if (!isHorizontalSwipe) return

    if (deltaX < 0) {
      showNext()
    } else {
      showPrev()
    }
  }, [showNext, showPrev])

  const lightboxImageStyle = useMemo<CSSProperties | undefined>(() => {
    if (!naturalSize) return undefined

    return {
      maxWidth: `min(92vw, ${naturalSize.width}px)`,
      maxHeight: `min(84svh, ${naturalSize.height}px)`,
    }
  }, [naturalSize])

  return (
    <>
      <div className={styles.masonry}>
        {photos.map((photo, index) => (
          <article key={`${photo.desktop}-${index}`} className={`${styles.card} ${ratioClass[photo.ratio]}`}>
            <button
              type="button"
              className={styles.cardButton}
              onClick={() => openPhoto(index)}
              aria-label={`${labels.openPhotoPrefix} ${index + 1}: ${photo.alt}`}
            >
              <picture>
                <source media="(max-width: 768px)" srcSet={photo.mobile} />
                <img
                  src={photo.desktop}
                  alt={photo.alt}
                  loading={index < 6 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </picture>

              <div className={styles.cardOverlay} aria-hidden="true">
                <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.cardTag}>{photo.tag}</span>
              </div>
            </button>
          </article>
        ))}
      </div>

      {activePhoto && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={activePhoto.alt} onClick={closePhoto}>
          <button
            type="button"
            className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
            aria-label={labels.previousPhoto}
            onClick={(event) => {
              event.stopPropagation()
              showPrev()
            }}
          >
            ‹
          </button>

          <figure
            className={styles.lightboxFigure}
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleLightboxTouchStart}
            onTouchEnd={handleLightboxTouchEnd}
          >
            <img
              src={activePhoto.desktop}
              alt={activePhoto.alt}
              className={styles.lightboxImage}
              style={lightboxImageStyle}
              onLoad={(event) => {
                setNaturalSize({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                })
              }}
            />

            <figcaption className={styles.lightboxCaption}>
              <span>{String(activePosition).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
              <span>{activePhoto.tag}</span>
            </figcaption>
          </figure>

          <button
            type="button"
            className={`${styles.lightboxNav} ${styles.lightboxNext}`}
            aria-label={labels.nextPhoto}
            onClick={(event) => {
              event.stopPropagation()
              showNext()
            }}
          >
            ›
          </button>

          <button
            type="button"
            className={styles.lightboxClose}
            aria-label={labels.closeLightbox}
            onClick={(event) => {
              event.stopPropagation()
              closePhoto()
            }}
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
