import type { Metadata } from 'next'
import Link from 'next/link'
import Cursor from '@/components/Cursor'
import { STATIC_GALLERY_PHOTOS } from '@/lib/gallery-static'
import { readManagedGalleryItems } from '@/lib/gallery-store'
import type { GalleryPhoto } from '@/lib/gallery-types'
import styles from './gallery.module.css'

const ratioClass: Record<GalleryPhoto['ratio'], string> = {
  wide: styles.ratioWide,
  tall: styles.ratioTall,
  square: styles.ratioSquare,
}

export const metadata: Metadata = {
  title: 'Galerie | Neue Liebe',
  description: 'Galerie mit Eindrücken aus Restaurant, Küche, Terrasse und Events der Neuen Liebe.',
}

export default async function GalleryPage() {
  const managedPhotos = await readManagedGalleryItems()
  const photos: GalleryPhoto[] = [
    ...managedPhotos.map((item) => ({
      desktop: item.desktop,
      mobile: item.mobile,
      alt: item.alt,
      tag: item.tag,
      ratio: item.ratio,
    })),
    ...STATIC_GALLERY_PHOTOS,
  ]

  return (
    <div className={styles.page}>
      <Cursor />

      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/" className={styles.brand}>
            Neue Liebe
            <span>Galerie</span>
          </Link>

          <div className={styles.topbarActions}>
            <Link href="/" className={styles.ghostBtn}>
              Zur Startseite
            </Link>
            <Link href="/#reservation" className={styles.primaryBtn}>
              Reservieren
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Einblicke in Neue Liebe</p>
            <h1 className={styles.title}>
              Unsere Galerie
            </h1>
            <p className={styles.lead}>
              Entdecken Sie Atmosphäre, Kulinarik und besondere Momente aus Restaurant, Terrasse und Events.
              Alle Bilder sind für mobile Geräte und Desktop optimiert.
            </p>
          </div>

          <div className={styles.heroFrame}>
            <picture>
              <source media="(max-width: 768px)" srcSet="/events2_800.webp" />
              <img
                src="/events2_1200.webp"
                alt="Stimmungsvolles Event in der Neuen Liebe"
                className={styles.heroImage}
              />
            </picture>
          </div>
        </section>

        <section className={styles.gallerySection}>
          <div className={styles.galleryHead}>
            <p className={styles.galleryKicker}>Momente</p>
            <h2 className={styles.galleryTitle}>Restaurant, Küche, Events</h2>
          </div>

          <div className={styles.masonry}>
            {photos.map((photo, index) => (
              <article key={photo.desktop} className={`${styles.card} ${ratioClass[photo.ratio]}`}>
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
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
