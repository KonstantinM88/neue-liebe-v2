'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FaqSection from '@/components/FaqSection'
import SeoTextSection from '@/components/SeoTextSection'
import SitePageShell from '@/components/SitePageShell'
import Events from '@/components/sections/Events'
import { type Lang, useLang } from '@/context/LangContext'
import { getPageFaqContent } from '@/lib/page-faqs'
import { getGalleryHref, getReservationHref } from '@/lib/site-nav'

function EventsPageContent() {
  const { lang, t } = useLang()
  const pathname = usePathname()
  const seoItems = [
    {
      title: t('Feiern mit gastronomischem Konzept', 'Celebrations with a Culinary Concept'),
      text: t(
        'Die Eventseite richtet sich an Gäste, die in Nebra eine Kombination aus Raum, Atmosphäre und Gastronomie suchen. Neue Liebe verbindet dabei nicht nur einen Ort für Feiern, sondern auch die passende kulinarische Begleitung.',
        'The events page is aimed at guests looking in Nebra for a combination of space, atmosphere and dining. Neue Liebe offers not just a venue for celebrations, but also the right culinary setting.'
      ),
    },
    {
      title: t('Räume für private und geschäftliche Anlässe', 'Spaces for Private and Business Occasions'),
      text: t(
        'Ob Hochzeit, Firmenfeier oder runder Geburtstag: Die Seite erklärt klar, dass unsere Räume für unterschiedliche Formate geeignet sind. Dadurch wird Neue Liebe auch als Eventlocation in Sachsen-Anhalt sichtbarer.',
        'Whether for a wedding, corporate event or milestone birthday, the page clearly communicates that our spaces work for different formats. This also makes Neue Liebe more visible as an event location in Saxony-Anhalt.'
      ),
    },
    {
      title: t('Kein Standardraum, sondern ein Erlebnis', 'Not a Standard Venue, but an Experience'),
      text: t(
        'Besonders für Suchanfragen rund um Eventlocation, Hochzeit oder Firmenfeier ist entscheidend, dass nicht nur Eckdaten genannt werden. Die Texte zeigen, warum Stimmung, Service und Gestaltung hier Teil des Angebots sind.',
        'For searches around event venues, weddings or corporate celebrations, it is important not to list bare facts only. The copy explains why atmosphere, service and design are part of the offering here.'
      ),
    },
  ]
  const faq = getPageFaqContent('events', lang)

  return (
    <main className="events-section" style={{ paddingTop: '80px' }}>
      <section
        style={{
          background:
            'radial-gradient(circle at 12% 10%, rgba(201,169,110,0.16) 0%, rgba(201,169,110,0) 42%), linear-gradient(180deg, #faf6f0 0%, #f1e4d2 100%)',
          padding: 'clamp(5rem, 8vw, 7rem) 4vw clamp(2.8rem, 5vw, 4rem)',
        }}
      >
        <div style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--gold)' }}>
            {t('Events & Feiern', 'Events & Celebrations')}
          </p>
          <h1
            className="section-title"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.4rem)', color: 'var(--charcoal)' }}
          >
            {t('Feste mit Atmosphäre und Charakter', 'Celebrations with Atmosphere and Character')}
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
              'Planen Sie Hochzeiten, Firmenfeiern oder stimmungsvolle Tanzabende in der Neuen Liebe. Wir verbinden Räume, Kulinarik und Gastlichkeit zu einem unvergesslichen Erlebnis.',
              'Plan weddings, corporate events or atmospheric dance evenings at Neue Liebe. We combine spaces, cuisine and hospitality into a memorable experience.'
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
              {t('Event anfragen', 'Request an Event')}
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

      <Events />
      <SeoTextSection
        eyebrow={t('Planung & Anlass', 'Planning & Occasion')}
        title={t(
          'Eventlocation in Nebra für Hochzeit, Firmenfeier und Tanzabend',
          'An Event Location in Nebra for Weddings, Corporate Events and Dance Evenings'
        )}
        lead={t(
          'Diese Seite ist bewusst auf Suchintentionen rund um Feiern, Eventlocation und besondere Abende ausgerichtet. So wird deutlicher, dass Neue Liebe in Nebra (Unstrut) sowohl für private Feste als auch für geschäftliche Veranstaltungen eine passende Adresse ist.',
          'This page is intentionally aligned with search intent around celebrations, event locations and memorable evenings. It makes it clearer that Neue Liebe in Nebra (Unstrut) is a fitting choice for both private and business occasions.'
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

type EventsPageClientProps = {
  initialLang?: Lang
}

export default function EventsPageClient({
  initialLang = 'de',
}: EventsPageClientProps) {
  return (
    <SitePageShell initialLang={initialLang}>
      <EventsPageContent />
    </SitePageShell>
  )
}
