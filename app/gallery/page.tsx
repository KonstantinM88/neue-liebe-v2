import type { Metadata } from 'next'
import Link from 'next/link'
import Cursor from '@/components/Cursor'
import styles from './gallery.module.css'

type GalleryPhoto = {
  desktop: string
  mobile: string
  alt: string
  tag: string
  ratio: 'wide' | 'tall' | 'square'
}

const photos: GalleryPhoto[] = [
  { desktop: '/events2_1200.webp', mobile: '/events2_800.webp', alt: 'Events am Abend', tag: 'Events', ratio: 'wide' },
  { desktop: '/firmen_1200.webp', mobile: '/firmen_800.webp', alt: 'Firmenveranstaltungen', tag: 'Business', ratio: 'wide' },
  { desktop: '/events3_1200.webp', mobile: '/events3_800.webp', alt: 'Tanz und Musik Event', tag: 'Tanz', ratio: 'wide' },
  { desktop: '/hochzeit_restaurant_desktop_1600x1200.webp', mobile: '/hochzeit_restaurant_mobile_800x600.webp', alt: 'Hochzeit im Restaurant', tag: 'Hochzeit', ratio: 'wide' },
  { desktop: '/banket.webp', mobile: '/banket.webp', alt: 'Bankettsaal', tag: 'Saal', ratio: 'square' },
  { desktop: '/momente_1200.webp', mobile: '/momente_800.webp', alt: 'Atmosphäre im Restaurant', tag: 'Atmosphäre', ratio: 'tall' },
  { desktop: '/kulinarik_1600.webp', mobile: '/kulinarik_1200.webp', alt: 'Fine Dining Teller', tag: 'Kulinarik', ratio: 'tall' },
  { desktop: '/terrace_1200.webp', mobile: '/terrace_800.webp', alt: 'Terrasse', tag: 'Terrasse', ratio: 'wide' },
  { desktop: '/german_food_1200.webp', mobile: '/german_food_800.webp', alt: 'Gericht der Küche', tag: 'Küche', ratio: 'tall' },
  { desktop: '/german_food2_1200.webp', mobile: '/german_food2_800.webp', alt: 'Spezialität des Hauses', tag: 'Küche', ratio: 'wide' },
  { desktop: '/soup_1200.webp', mobile: '/soup_800.webp', alt: 'Vorspeise Suppe', tag: 'Vorspeise', ratio: 'square' },
  { desktop: '/wuerzfleisch_1200w.webp', mobile: '/wuerzfleisch_800w.webp', alt: 'Würzfleisch', tag: 'Klassiker', ratio: 'square' },
  { desktop: '/schnitzel_1200.webp', mobile: '/schnitzel_800.webp', alt: 'Schnitzel', tag: 'Klassiker', ratio: 'tall' },
  { desktop: '/schnitzel_plate_1200.webp', mobile: '/schnitzel_plate_800.webp', alt: 'Schnitzelgericht', tag: 'Küche', ratio: 'wide' },
  { desktop: '/schnitzel_au_four_1200.webp', mobile: '/schnitzel_au_four_800.webp', alt: 'Schnitzel au four', tag: 'Küche', ratio: 'tall' },
  { desktop: '/hacksteak_1200.webp', mobile: '/hacksteak_800.webp', alt: 'Hacksteak', tag: 'Küche', ratio: 'square' },
  { desktop: '/pfannenschaschlik_1200.webp', mobile: '/pfannenschaschlik_800.webp', alt: 'Pfannenschaschlik', tag: 'Küche', ratio: 'tall' },
  { desktop: '/pork_plate_1200.webp', mobile: '/pork_plate_800.webp', alt: 'Schüsselsülze', tag: 'Klassiker', ratio: 'wide' },
  { desktop: '/sausage_plate_1200.webp', mobile: '/sausage_plate_800.webp', alt: 'Currywurst', tag: 'Klassiker', ratio: 'square' },
  { desktop: '/burger_st_georg_desktop_1600x1200.webp', mobile: '/burger_st_georg_mobile_900.webp', alt: 'Burger St. Georg', tag: 'Burger', ratio: 'wide' },
  { desktop: '/backfisch_desktop_1600x1200.webp', mobile: '/backfisch_mobile_900.webp', alt: 'Backfisch', tag: 'Klassiker', ratio: 'tall' },
  { desktop: '/geschnetzeltes_desktop_1600x1200.webp', mobile: '/geschnetzeltes_mobile_900.webp', alt: 'Geschnetzeltes', tag: 'Küche', ratio: 'tall' },
  { desktop: '/nebraer_biersteak_desktop_1600x1200.webp', mobile: '/nebraer_biersteak_mobile_900.webp', alt: 'Nebraer Biersteak', tag: 'Steak', ratio: 'wide' },
  { desktop: '/schweinemedaillons_desktop_1600x1200.webp', mobile: '/schweinemedaillons_mobile_900.webp', alt: 'Schweinemedaillons', tag: 'Steak', ratio: 'wide' },
  { desktop: '/zigeuner_steak_desktop_1600x1200.webp', mobile: '/zigeuner_steak_mobile_900.webp', alt: 'Zigeuner-Steak', tag: 'Steak', ratio: 'square' },
  { desktop: '/bauernfruhstuck_desktop_1600x1200.webp', mobile: '/bauernfruhstuck_mobile_900.webp', alt: 'Bauernfrühstück', tag: 'Klassiker', ratio: 'wide' },
  { desktop: '/strammer_max_desktop_1600x1200.webp', mobile: '/strammer_max_mobile_900.webp', alt: 'Strammer Max', tag: 'Klassiker', ratio: 'square' },
  { desktop: '/german_snacks_desktop.webp', mobile: '/german_snacks_mobile.webp', alt: 'Snacks zum Bier', tag: 'Snacks', ratio: 'tall' },
  { desktop: '/kostritzer_desktop.webp', mobile: '/kostritzer_mobile.webp', alt: 'Bier und Drinks', tag: 'Drinks', ratio: 'tall' },
]

const ratioClass: Record<GalleryPhoto['ratio'], string> = {
  wide: styles.ratioWide,
  tall: styles.ratioTall,
  square: styles.ratioSquare,
}

export const metadata: Metadata = {
  title: 'Galerie | Neue Liebe',
  description: 'Galerie mit Eindrücken aus Restaurant, Küche, Terrasse und Events der Neuen Liebe.',
}

export default function GalleryPage() {
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
