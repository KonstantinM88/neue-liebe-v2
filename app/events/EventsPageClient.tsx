'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SitePageShell from '@/components/SitePageShell'
import Events from '@/components/sections/Events'
import { type Lang, useLang } from '@/context/LangContext'
import { getGalleryHref, getReservationHref } from '@/lib/site-nav'

function EventsPageContent() {
  const { t } = useLang()
  const pathname = usePathname()

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
