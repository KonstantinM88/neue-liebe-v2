'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SitePageShell from '@/components/SitePageShell'
import MenuSection from '@/components/sections/MenuSection'
import { type Lang, useLang } from '@/context/LangContext'
import { getReservationHref } from '@/lib/site-nav'
import type { MenuCategory, MenuDish } from '@/lib/menu-types'

type MenuPageContentProps = {
  categories: MenuCategory[]
  dishes: MenuDish[]
}

function MenuPageContent({ categories, dishes }: MenuPageContentProps) {
  const { t } = useLang()
  const pathname = usePathname()

  return (
    <main style={{ background: 'var(--cream)', paddingTop: '80px' }}>
      <section
        style={{
          background:
            'radial-gradient(circle at 12% 10%, rgba(201,169,110,0.14) 0%, rgba(201,169,110,0) 42%), linear-gradient(180deg, #faf6f0 0%, #f1e6d5 100%)',
          padding: 'clamp(5rem, 8vw, 7rem) 4vw clamp(2.8rem, 5vw, 4rem)',
        }}
      >
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--gold)' }}>
            {t('Speisekarte Neue Liebe', 'Neue Liebe Menu')}
          </p>
          <h1
            className="section-title"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.4rem)', color: 'var(--charcoal)' }}
          >
            {t('Regionale Küche mit Charakter', 'Regional Cuisine with Character')}
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
              'Entdecken Sie Vorspeisen, Hauptgerichte, Klassiker, Burger, Steaks und ausgewählte Drinks der Neuen Liebe in Nebra (Unstrut).',
              'Discover starters, main courses, classics, burgers, steaks and selected drinks from Neue Liebe in Nebra (Unstrut).'
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
            <a
              href="#menu"
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
              {t('Gerichte entdecken', 'Explore Dishes')}
            </a>
          </div>
        </div>
      </section>

      <MenuSection
        initialCategories={categories}
        initialDishes={dishes}
        loadRemoteOnInView={false}
      />
    </main>
  )
}

type MenuPageClientProps = {
  categories: MenuCategory[]
  dishes: MenuDish[]
  initialLang?: Lang
}

export default function MenuPageClient({
  categories,
  dishes,
  initialLang = 'de',
}: MenuPageClientProps) {
  return (
    <SitePageShell initialLang={initialLang}>
      <MenuPageContent categories={categories} dishes={dishes} />
    </SitePageShell>
  )
}
