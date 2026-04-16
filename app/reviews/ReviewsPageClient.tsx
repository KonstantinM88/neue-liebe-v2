'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FaqSection from '@/components/FaqSection'
import SeoTextSection from '@/components/SeoTextSection'
import SitePageShell from '@/components/SitePageShell'
import Reviews from '@/components/sections/Reviews'
import { type Lang, useLang } from '@/context/LangContext'
import { getPageFaqContent } from '@/lib/page-faqs'
import { getGalleryHref, getReservationHref } from '@/lib/site-nav'

function ReviewsPageContent() {
  const { lang, t } = useLang()
  const pathname = usePathname()
  const seoItems = [
    {
      title: t('Service und Atmosphäre im Fokus', 'Service and Atmosphere in Focus'),
      text: t(
        'Restaurant-Bewertungen helfen neuen Gästen einzuschätzen, ob ein Besuch zur eigenen Erwartung passt. Auf dieser Seite stehen daher nicht nur Sterne, sondern echte Eindrücke zu Service, Stimmung und Erlebnis im Mittelpunkt.',
        'Restaurant reviews help new guests judge whether a visit matches their expectations. That is why this page focuses not only on ratings, but also on real impressions of service, atmosphere and the overall experience.'
      ),
    },
    {
      title: t('Warum Gäste Küche und Ambiente hervorheben', 'Why Guests Highlight Cuisine and Ambience'),
      text: t(
        'Viele Rückmeldungen zur Neuen Liebe drehen sich um die Kombination aus Essen, Einrichtung und Gastlichkeit. Gerade für Suchanfragen nach Restaurantbewertungen in Nebra entsteht dadurch ein glaubwürdigeres Gesamtbild.',
        'Many comments about Neue Liebe focus on the combination of food, interior design and hospitality. Especially for searches related to restaurant reviews in Nebra, this creates a more credible overall picture.'
      ),
    },
    {
      title: t('Vertrauen vor der Reservierung aufbauen', 'Building Trust before a Reservation'),
      text: t(
        'Bewertungen sind oft der letzte Schritt vor einer Reservierung. Indem die Seite echte Stimmen bündelt, stärkt sie das Vertrauen von Gästen, die zwischen mehreren Restaurants oder Eventorten vergleichen.',
        'Reviews are often the final step before making a reservation. By bringing together real voices, the page strengthens trust for guests comparing several restaurants or venues.'
      ),
    },
  ]
  const faq = getPageFaqContent('reviews', lang)

  return (
    <main className="reviews-section" style={{ paddingTop: '80px' }}>
      <section
        style={{
          background:
            'radial-gradient(circle at 12% 10%, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0) 42%), linear-gradient(180deg, #faf6f0 0%, #efe3d2 100%)',
          padding: 'clamp(5rem, 8vw, 7rem) 4vw clamp(2.8rem, 5vw, 4rem)',
        }}
      >
        <div style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--gold)' }}>
            {t('Bewertungen unserer Gäste', 'Guest Reviews')}
          </p>
          <h1
            className="section-title"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.4rem)', color: 'var(--charcoal)' }}
          >
            {t('Was Gäste über Neue Liebe sagen', 'What Guests Say about Neue Liebe')}
          </h1>
          <p
            style={{
              maxWidth: 760,
              margin: '1.4rem auto 0',
              fontSize: 'clamp(1rem, 1.8vw, 1.08rem)',
              lineHeight: 1.85,
              color: 'var(--brown-light)',
              fontWeight: 300,
            }}
          >
            {t(
              'Lesen Sie Stimmen unserer Gäste zu Atmosphäre, Küche, Service und besonderen Momenten in der Neuen Liebe in Nebra (Unstrut).',
              'Read what our guests say about the atmosphere, cuisine, service and memorable moments at Neue Liebe in Nebra (Unstrut).'
            )}
          </p>

          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '0.9rem',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href={getReservationHref(pathname)}
              className="nav-cta"
              style={{ minWidth: 220 }}
            >
              {t('Jetzt reservieren', 'Reserve Now')}
            </Link>
            <Link
              href={getGalleryHref(pathname)}
              style={{
                minWidth: 220,
                padding: '11px 24px',
                borderRadius: 999,
                border: '1px solid rgba(74,55,40,0.16)',
                color: 'var(--charcoal)',
                textDecoration: 'none',
                fontFamily: "'Jost', sans-serif",
                fontSize: '0.7rem',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.5) 100%)',
                boxShadow: '0 12px 30px rgba(26,23,20,0.08)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {t('Galerie ansehen', 'View Gallery')}
            </Link>
          </div>
        </div>
      </section>

      <Reviews />
      <SeoTextSection
        eyebrow={t('Stimmen & Vertrauen', 'Voices & Trust')}
        title={t(
          'Bewertungen als Orientierung für neue Gäste',
          'Reviews as Guidance for New Guests'
        )}
        lead={t(
          'Die Bewertungsseite ergänzt die eigentlichen Rezensionen um kontextreiche Texte. Dadurch wird für Suchmaschinen und Besucher klarer, dass es hier um reale Erfahrungen mit Küche, Service und Atmosphäre der Neuen Liebe in Nebra (Unstrut) geht.',
          'The reviews page complements the actual testimonials with additional contextual copy. This makes it clearer for both search engines and visitors that the page is about real experiences with the cuisine, service and atmosphere at Neue Liebe in Nebra (Unstrut).'
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

type ReviewsPageClientProps = {
  initialLang?: Lang
}

export default function ReviewsPageClient({
  initialLang = 'de',
}: ReviewsPageClientProps) {
  return (
    <SitePageShell initialLang={initialLang}>
      <ReviewsPageContent />
    </SitePageShell>
  )
}
