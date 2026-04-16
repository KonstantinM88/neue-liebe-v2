'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/context/LangContext'
import { switchLocalePath } from '@/lib/site-locale'
import { getLogoHref, getReservationHref, PRIMARY_NAV_ITEMS, resolveSiteHref } from '@/lib/site-nav'

interface NavigationProps {
  mobileOpen: boolean
  onHamburger: () => void
}

export default function Navigation({ mobileOpen, onHamburger }: NavigationProps) {
  const { lang, t } = useLang()
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const isInnerPage = pathname !== '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      ref={navRef}
      id="navbar"
      className={`${scrolled ? 'scrolled' : ''}${isInnerPage ? ' page-nav' : ''}`}
    >
      {/* Logo */}
      <Link href={getLogoHref(pathname)} className="nav-logo">
        Neue Liebe
        <span>Restaurant • Nebra (Unstrut)</span>
      </Link>

      {/* Desktop links */}
      <ul className="nav-links">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <li key={item.key}>
            <Link href={resolveSiteHref(pathname, item)}>{t(item.de, item.en)}</Link>
          </li>
        ))}
      </ul>

      {/* Right: lang + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <Link
            className={`lang-btn${lang === 'de' ? ' active' : ''}`}
            href={switchLocalePath(pathname, 'de')}
            hrefLang="de"
            lang="de"
          >
            DE
          </Link>
          <span
            style={{
              color: isInnerPage ? 'rgba(74, 55, 40, 0.22)' : 'rgba(255,255,255,0.2)',
              fontSize: '0.7rem',
            }}
          >
            |
          </span>
          <Link
            className={`lang-btn${lang === 'en' ? ' active' : ''}`}
            href={switchLocalePath(pathname, 'en')}
            hrefLang="en"
            lang="en"
          >
            EN
          </Link>
        </div>

        <Link href={getReservationHref(pathname)} className="nav-cta">
          {t('Reservieren', 'Reserve')}
        </Link>
      </div>

      {/* Hamburger */}
      <button
        className="hamburger"
        id="hamburger"
        aria-label="Menu"
        onClick={onHamburger}
      >
        <span
          style={{
            transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : undefined,
          }}
        />
        <span style={{ opacity: mobileOpen ? 0 : 1 }} />
        <span
          style={{
            transform: mobileOpen ? 'translateY(-6px) rotate(-45deg)' : undefined,
          }}
        />
      </button>
    </nav>
  )
}
