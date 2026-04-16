'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SitePageShell from '@/components/SitePageShell'
import About from '@/components/sections/About'
import { type Lang, useLang } from '@/context/LangContext'
import { getMenuHref, getReservationHref } from '@/lib/site-nav'

function AboutPageContent() {
  const { t } = useLang()
  const pathname = usePathname()

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
