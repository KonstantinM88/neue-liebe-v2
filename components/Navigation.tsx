'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/context/LangContext'

interface NavigationProps {
  mobileOpen: boolean
  onHamburger: () => void
}

export default function Navigation({ mobileOpen, onHamburger }: NavigationProps) {
  const { lang, setLang, t } = useLang()
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#about',       de: 'Über uns',    en: 'About' },
    { href: '#experience',  de: 'Erlebnisse',  en: 'Experiences' },
    { href: '#menu',        de: 'Speisekarte', en: 'Menu' },
    { href: '/gallery',     de: 'Galerie',     en: 'Gallery' },
    { href: '#events',      de: 'Events',      en: 'Events' },
    { href: '#reviews',     de: 'Bewertungen', en: 'Reviews' },
    { href: '#contact',     de: 'Kontakt',     en: 'Contact' },
  ]

  return (
    <nav ref={navRef} id="navbar" className={scrolled ? 'scrolled' : ''}>
      {/* Logo */}
      <a href="#hero" className="nav-logo">
        Neue Liebe
        <span>Restaurant • Nebra (Unstrut)</span>
      </a>

      {/* Desktop links */}
      <ul className="nav-links">
        {links.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{t(l.de, l.en)}</a>
          </li>
        ))}
      </ul>

      {/* Right: lang + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <button
            className={`lang-btn${lang === 'de' ? ' active' : ''}`}
            onClick={() => setLang('de')}
          >
            DE
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>|</span>
          <button
            className={`lang-btn${lang === 'en' ? ' active' : ''}`}
            onClick={() => setLang('en')}
          >
            EN
          </button>
        </div>

        <a href="#reservation" className="nav-cta">
          {t('Reservieren', 'Reserve')}
        </a>
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
