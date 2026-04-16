'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SitePageShell from '@/components/SitePageShell'
import Experience from '@/components/sections/Experience'
import { type Lang, useLang } from '@/context/LangContext'
import { getMenuHref, getReservationHref } from '@/lib/site-nav'

function ExperiencePageContent() {
  const { t } = useLang()
  const pathname = usePathname()

  return (
    <main style={{ background: 'var(--charcoal)', paddingTop: '80px' }}>
      <section
        style={{
          background:
            'radial-gradient(circle at 12% 10%, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0) 42%), linear-gradient(180deg, #201b16 0%, #15110d 100%)',
          padding: 'clamp(5rem, 8vw, 7rem) 4vw clamp(2.8rem, 5vw, 4rem)',
        }}
      >
        <div style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--gold)' }}>
            {t('Erlebnisse in Neue Liebe', 'Experiences at Neue Liebe')}
          </p>
          <h1
            className="section-title"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.4rem)', color: '#fff' }}
          >
            {t('Atmosphäre, Genuss und besondere Momente', 'Atmosphere, indulgence and memorable moments')}
          </h1>
          <p
            style={{
              maxWidth: 760,
              margin: '1.4rem auto 0',
              fontSize: 'clamp(1rem, 1.8vw, 1.08rem)',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.72)',
              fontWeight: 300,
            }}
          >
            {t(
              'Entdecken Sie unsere Sommerterrasse, den eleganten Bankettsaal und stimmungsvolle Tanz- und Eventabende. Jede Erlebniswelt der Neuen Liebe verbindet Gastlichkeit, Stil und besondere Augenblicke.',
              'Discover our summer terrace, the elegant banquet hall and vibrant dance and event evenings. Every experience at Neue Liebe combines hospitality, style and memorable moments.'
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
              href={getMenuHref(pathname)}
              style={{
                minWidth: 220,
                padding: '11px 24px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.16)',
                color: '#fff',
                textDecoration: 'none',
                fontFamily: "'Jost', sans-serif",
                fontSize: '0.7rem',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {t('Zur Speisekarte', 'View Menu')}
            </Link>
          </div>
        </div>
      </section>

      <Experience />
    </main>
  )
}

type ExperiencePageClientProps = {
  initialLang?: Lang
}

export default function ExperiencePageClient({
  initialLang = 'de',
}: ExperiencePageClientProps) {
  return (
    <SitePageShell initialLang={initialLang}>
      <ExperiencePageContent />
    </SitePageShell>
  )
}
