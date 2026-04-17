'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FaqSection from '@/components/FaqSection'
import SeoTextSection from '@/components/SeoTextSection'
import SitePageShell from '@/components/SitePageShell'
import About from '@/components/sections/About'
import { type Lang, useLang } from '@/context/LangContext'
import { getPageFaqContent } from '@/lib/page-faqs'
import { getMenuHref, getReservationHref } from '@/lib/site-nav'

function AboutPageContent() {
  const { lang, t } = useLang()
  const pathname = usePathname()
  const seoItems = [
    {
      title: t(
        'Regionale Küche & Kulinarischer Genuss in Nebra (Unstrut)',
        'Regional Cuisine & Culinary Delight in Nebra (Unstrut)'
      ),
      text: t(
        'Entdecken Sie im Restaurant Neue Liebe in Nebra (Unstrut) eine einzigartige Verbindung aus frischen, regionalen Zutaten und moderner Kochkunst. Unser erstklassiges Speiseangebot bietet Ihnen ein unvergessliches Geschmackserlebnis, das die Tradition der Unstrut-Region mit kreativer Raffinesse neu interpretiert.',
        'Discover a unique blend of fresh, regional ingredients and modern culinary art at Restaurant Neue Liebe in Nebra (Unstrut). Our premium menu offers an unforgettable dining experience, reinterpreting the tradition of the Unstrut region with creative sophistication.'
      ),
    },
    {
      title: t(
        'Entspanntes Essen, Sonnenterrasse & Ideale Eventlocation',
        'Relaxed Dining, Sun Terrace & Perfect Event Location'
      ),
      text: t(
        'Egal ob ein gemütliches Abendessen, entspannte Stunden auf unserer malerischen Sommerterrasse oder exklusive Veranstaltungen und Familienfeiern: Die Neue Liebe überzeugt als Top-Location in Nebra mit herzlichem Service, erstklassiger Gastronomie und einladendem Ambiente.',
        'Whether it is a cozy dinner, relaxing hours on our picturesque summer terrace, or exclusive events and family celebrations: Neue Liebe stands out as a top location in Nebra, offering warm service, first-class gastronomy, and an inviting ambiance.'
      ),
    },
    {
      title: t(
        'Ihr erstklassiges Restaurant in Nebra für besondere Momente',
        'Your Outstanding Restaurant in Nebra for Special Moments'
      ),
      text: t(
        'Wer hervorragendes Essen und ein ausgezeichnetes Restaurant in Nebra sucht, findet in der Neuen Liebe mehr als nur Speisen. Ein stilvolles Interieur, gelebte Gastfreundschaft und eine lebendige Eventkultur machen jeden Besuch zu einem besonderen Erlebnis an idyllischen Unstrut.',
        'Anyone looking for excellent food and an outstanding restaurant in Nebra will find more than just a meal at Neue Liebe. A stylish interior, genuine hospitality, and a vibrant event culture make every visit a special experience along the idyllic Unstrut river.'
      ),
    },
  ]
  const faq = getPageFaqContent('about', lang)

  return (
    <main style={{ background: 'var(--cream)', paddingTop: '80px' }}>
      <section
        style={{
          background:
            'radial-gradient(circle at 12% 10%, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0) 42%), linear-gradient(180deg, #faf6f0 0%, #f5ede0 100%)',
          padding: 'clamp(5rem, 8vw, 7rem) 4vw clamp(2.5rem, 5vw, 4rem)',
        }}
      >
        <div style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--gold)' }}>
            {t('Über Neue Liebe', 'About Neue Liebe')}
          </p>
          <h1
            className="section-title"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.4rem)', color: 'var(--charcoal)' }}
          >
            {t('Unsere Geschichte', 'Our Story')}
          </h1>
          <p
            style={{
              maxWidth: 720,
              margin: '1.4rem auto 0',
              fontSize: 'clamp(1rem, 1.8vw, 1.08rem)',
              lineHeight: 1.85,
              color: 'var(--brown-light)',
              fontWeight: 300,
            }}
          >
            {t(
              'Erfahren Sie mehr über die Neue Liebe in Nebra (Unstrut): unsere Geschichte, unsere Werte und den Anspruch, regionale Küche, Atmosphäre und Gastfreundschaft auf hohem Niveau zu verbinden.',
              'Learn more about Neue Liebe in Nebra (Unstrut): our story, our values, and how we bring together regional cuisine, atmosphere, and hospitality at a high standard.'
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
              {t('Tisch reservieren', 'Reserve a Table')}
            </Link>
            <Link
              href={getMenuHref(pathname)}
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
              {t('Speisekarte ansehen', 'View Menu')}
            </Link>
          </div>
        </div>
      </section>

      <About />
      <SeoTextSection
        eyebrow={t('Mehr über Neue Liebe', 'More about Neue Liebe')}
        title={t(
          'Restaurantkultur in Nebra mit regionaler Identität',
          'Restaurant Culture in Nebra with a Regional Identity'
        )}
        lead={t(
          'Die Seite „Über uns“ soll nicht nur unsere Geschichte erzählen, sondern auch verständlich machen, wofür Neue Liebe in Nebra (Unstrut) steht: für regionale Küche, herzlichen Service und eine Atmosphäre, die Alltag und besondere Anlässe zusammenbringt.',
          'The About page is not only here to tell our story, but also to explain what Neue Liebe in Nebra (Unstrut) stands for: regional cuisine, warm service and an atmosphere that works for everyday visits as well as special occasions.'
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

type AboutPageClientProps = {
  initialLang?: Lang
}

export default function AboutPageClient({ initialLang = 'de' }: AboutPageClientProps) {
  return (
    <SitePageShell initialLang={initialLang}>
      <AboutPageContent />
    </SitePageShell>
  )
}
