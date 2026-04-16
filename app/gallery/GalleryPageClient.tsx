'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SitePageShell from '@/components/SitePageShell'
import { type Lang, useLang } from '@/context/LangContext'
import { buildLocalizedPath, getPathLocale } from '@/lib/site-locale'
import { getReservationHref } from '@/lib/site-nav'
import type { GalleryPhoto } from '@/lib/gallery-types'
import GalleryMasonry from './GalleryMasonry'
import styles from './gallery.module.css'

type GalleryPageContentProps = {
  photos: GalleryPhoto[]
}

function GalleryPageContent({ photos }: GalleryPageContentProps) {
  const { t } = useLang()
  const pathname = usePathname()
  const homeHref = buildLocalizedPath(getPathLocale(pathname), '/')

  return (
    <main className={styles.main} style={{ paddingTop: '80px' }}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>
            {t('Einblicke in Neue Liebe', 'A Glimpse into Neue Liebe')}
          </p>
          <h1 className={styles.title}>
            {t('Unsere Galerie', 'Our Gallery')}
          </h1>
          <p className={styles.lead}>
            {t(
              'Entdecken Sie Atmosphäre, Kulinarik und besondere Momente aus Restaurant, Terrasse und Events. Alle Bilder sind für mobile Geräte und Desktop optimiert.',
              'Discover atmosphere, cuisine and memorable moments from our restaurant, terrace and events. All images are optimized for mobile devices and desktop.'
            )}
          </p>

          <div className={styles.topbarActions} style={{ marginTop: '1.8rem' }}>
            <Link href={getReservationHref(pathname)} className={styles.primaryBtn}>
              {t('Reservieren', 'Reserve')}
            </Link>
            <Link href={homeHref} className={styles.ghostBtn}>
              {t('Zur Startseite', 'Back to Home')}
            </Link>
          </div>
        </div>

        <div className={styles.heroFrame}>
          <picture>
            <source media="(max-width: 768px)" srcSet="/events2_800.webp" />
            <img
              src="/events2_1200.webp"
              alt={t('Stimmungsvolles Event in der Neuen Liebe', 'Atmospheric event at Neue Liebe')}
              className={styles.heroImage}
            />
          </picture>
        </div>
      </section>

      <section className={styles.gallerySection}>
        <div className={styles.galleryHead}>
          <p className={styles.galleryKicker}>{t('Momente', 'Moments')}</p>
          <h2 className={styles.galleryTitle}>
            {t('Restaurant, Küche, Events', 'Restaurant, Cuisine, Events')}
          </h2>
        </div>

        <GalleryMasonry
          photos={photos}
          labels={{
            openPhotoPrefix: t('Foto', 'Photo'),
            previousPhoto: t('Vorheriges Foto', 'Previous Photo'),
            nextPhoto: t('Nächstes Foto', 'Next Photo'),
            closeLightbox: t('Schließen', 'Close'),
          }}
        />
      </section>
    </main>
  )
}

type GalleryPageClientProps = {
  photos: GalleryPhoto[]
  initialLang?: Lang
}

export default function GalleryPageClient({
  photos,
  initialLang = 'de',
}: GalleryPageClientProps) {
  return (
    <SitePageShell initialLang={initialLang}>
      <GalleryPageContent photos={photos} />
    </SitePageShell>
  )
}
