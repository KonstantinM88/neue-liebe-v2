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
      title: t(
        'Einzigartiges Ambiente in Bildern erleben',
        'Experience a Unique Ambiance in Pictures'
      ),
      text: t(
        'Machen Sie sich einen ersten Eindruck von den stilvoll gestalteten Räumlichkeiten unseres Restaurants in Nebra. Die Mischung aus modernem Design und gemütlichem Charme schafft eine unvergleichliche Wohlfühlatmosphäre.',
        'Get a first impression of the stylishly designed rooms of our restaurant in Nebra. The mix of modern design and cozy charm creates an incomparable feel-good atmosphere.'
      ),
    },
    {
      title: t(
        'Kulinarische Fotogalerie & Speisenpräsentation',
        'Culinary Photo Gallery & Food Presentation'
      ),
      text: t(
        'Das Auge isst mit: Unsere Galerie zeigt Ihnen liebevoll angerichtete Teller, meisterhafte Details aus unserer Küche und köstliche Gerichte, die unsere Passion für hochwertige Gastronomie widerspiegeln.',
        'You eat with your eyes first: Our gallery shows you lovingly arranged plates, masterful details from our kitchen, and delicious dishes that reflect our passion for high-quality gastronomy.'
      ),
    },
    {
      title: t(
        'Eindrucksvolle Event-Momente & Hochzeiten',
        'Impressive Event Moments & Weddings'
      ),
      text: t(
        'Lassen Sie sich von eindrucksvollen Bildern unserer vergangenen Veranstaltungen inspirieren. Von prachtvollen Hochzeitsfeiern bis hin zu stimmungsvollen Tanzabenden auf der Terrasse – visuelle Eindrücke für Ihr nächstes Event.',
        'Be inspired by impressive pictures of our past events. From magnificent wedding celebrations to atmospheric dance evenings on the terrace – visual impressions for your next event.'
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
        eyebrow={t('Unsere Bildergalerie', 'Our Image Gallery')}
        title={t(
          'Entdecken Sie die Schönheit der Neuen Liebe',
          'Discover the Beauty of Neue Liebe'
        )}
        lead={t(
          'Tauchen Sie visuell in die Welt der Neuen Liebe in Nebra (Unstrut) ein. Von faszinierenden Detailaufnahmen unserer Speisen bis hin zu wunderschönen Eindrücken unserer Event- und Terrassenbereiche.',
          'Dive visually into the world of Neue Liebe in Nebra (Unstrut). From fascinating detailed shots of our dishes to beautiful impressions of our event and terrace areas.'
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
