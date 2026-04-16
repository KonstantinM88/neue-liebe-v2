'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FaqSection from '@/components/FaqSection'
import SeoTextSection from '@/components/SeoTextSection'
import SitePageShell from '@/components/SitePageShell'
import { type Lang, useLang } from '@/context/LangContext'
import { getPageFaqContent } from '@/lib/page-faqs'
import { buildLocalizedPath, getPathLocale } from '@/lib/site-locale'
import { getReservationHref } from '@/lib/site-nav'
import type { GalleryPhoto } from '@/lib/gallery-types'
import GalleryMasonry from './GalleryMasonry'
import styles from './gallery.module.css'

type GalleryPageContentProps = {
  photos: GalleryPhoto[]
}

function GalleryPageContent({ photos }: GalleryPageContentProps) {
  const { lang, t } = useLang()
  const pathname = usePathname()
  const homeHref = buildLocalizedPath(getPathLocale(pathname), '/')
  const seoItems = [
    {
      title: t('Atmosphäre vor dem ersten Besuch erleben', 'Experience the Atmosphere before Your Visit'),
      text: t(
        'Die Galerie hilft neuen Gästen dabei, das Ambiente der Neuen Liebe bereits vor dem Besuch einzuordnen. Bilder aus Restaurant, Terrasse und Veranstaltungen machen die Wirkung des Hauses in Nebra (Unstrut) greifbarer.',
        'The gallery helps new guests understand the atmosphere of Neue Liebe before they even visit. Images from the restaurant, terrace and events make the place in Nebra (Unstrut) easier to imagine.'
      ),
    },
    {
      title: t('Kulinarik und Details aus der Küche', 'Cuisine and Details from the Kitchen'),
      text: t(
        'Neben Räumen und Stimmung zeigt die Galerieseite auch Speisen und Details aus der Küche. Das ist besonders relevant für Gäste, die sich vor einer Reservierung einen realistischen Eindruck vom Stil des Restaurants verschaffen möchten.',
        'Alongside rooms and atmosphere, the gallery page also highlights dishes and kitchen details. This is especially useful for guests who want a realistic impression of the restaurant style before making a reservation.'
      ),
    },
    {
      title: t('Einblicke in Events, Feiern und Terrasse', 'Insights into Events, Celebrations and the Terrace'),
      text: t(
        'Für Feiern, Sommerabende oder geschäftliche Anlässe liefert die Galerie zusätzliche visuelle Orientierung. Dadurch ergänzt sie die Event- und Erlebnis-Seiten sinnvoll und stärkt die interne thematische Verknüpfung.',
        'For celebrations, summer evenings or business occasions, the gallery provides additional visual orientation. This complements the events and experiences pages and strengthens the internal thematic linking.'
      ),
    },
  ]
  const faq = getPageFaqContent('gallery', lang)

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
      <SeoTextSection
        eyebrow={t('Visueller Eindruck', 'Visual Impression')}
        title={t(
          'Bilder, die Restaurant, Küche und Veranstaltungen zeigen',
          'Images that Show the Restaurant, Cuisine and Events'
        )}
        lead={t(
          'Die Galerie ist mehr als eine Sammlung schöner Motive. Sie zeigt Gästen, wie Neue Liebe in Nebra (Unstrut) aussieht, wie Gerichte präsentiert werden und welche Atmosphäre bei Terrasse, Restaurant und Veranstaltungen entsteht.',
          'The gallery is more than a collection of attractive images. It shows guests what Neue Liebe in Nebra (Unstrut) looks like, how dishes are presented and what kind of atmosphere the terrace, restaurant and events create.'
        )}
        items={seoItems}
      />
      <FaqSection
        eyebrow={faq.eyebrow}
        title={faq.title}
        lead={faq.lead}
        items={faq.items}
      />
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
