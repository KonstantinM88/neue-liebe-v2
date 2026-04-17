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
      title: t(
        'Eines der besten Restaurants in Nebra',
        'One of the Best Restaurants in Nebra'
      ),
      text: t(
        'Warum zählen wir zu den bestbewerteten Restaurants an der Unstrut? Unsere Gäste schätzen vor allem die erstklassige Qualität unserer Speisen, die frischen Zutaten und die Liebe zum kreativen Detail auf jedem Teller.',
        'Why are we among the top-rated restaurants along the Unstrut? Our guests particularly appreciate the first-class quality of our dishes, the fresh ingredients, and the love for creative detail on every plate.'
      ),
    },
    {
      title: t(
        'Herzliche Gastfreundschaft & Top-Service',
        'Warm Hospitality & Top Service'
      ),
      text: t(
        'Für uns ist ein Restaurantbesuch mehr als nur Essen. Wir leben echte Gastfreundschaft. Unser aufmerksames Team sorgt dafür, dass Ihr Aufenthalt in der Neuen Liebe zu einem rundum perfekten Erlebnis wird.',
        'For us, visiting a restaurant is more than just eating. We live genuine hospitality. Our attentive team ensures that your stay at Neue Liebe becomes a completely perfect experience.'
      ),
    },
    {
      title: t(
        'Echte Erfahrungen unserer zufriedenen Gäste',
        'Real Experiences from Our Satisfied Guests'
      ),
      text: t(
        'Überzeugen Sie sich selbst von unserem hohen Standard. Die vielen positiven Bewertungen und persönlichen Erfahrungsberichte unserer Gäste sprechen für sich und machen uns stolz.',
        'See our high standards for yourself. The many positive reviews and personal testimonials from our guests speak for themselves and make us proud.'
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
        eyebrow={t('Gästeerfahrungen', 'Guest Experiences')}
        title={t(
          'Qualität und Service, die überzeugen',
          'Quality and Service that Impress'
        )}
        lead={t(
          'Entdecken Sie, warum Gäste aus der ganzen Region die Neue Liebe in Nebra (Unstrut) empfehlen. Wir bedanken uns für das großartige Feedback zu unserer Küche, dem Ambiente und unserem engagierten Team.',
          'Discover why guests from all over the region recommend Neue Liebe in Nebra (Unstrut). We are grateful for the amazing feedback regarding our cuisine, ambiance, and our dedicated team.'
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
