'use client'

import { useLang } from '@/context/LangContext'

interface Props {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: Props) {
  const { t } = useLang()

  const links = [
    { href: '#about',      de: 'Über uns',    en: 'About' },
    { href: '#experience', de: 'Erlebnisse',  en: 'Experiences' },
    { href: '#menu',       de: 'Speisekarte', en: 'Menu' },
    { href: '#gallery',    de: 'Galerie',     en: 'Gallery' },
    { href: '#events',     de: 'Events',      en: 'Events' },
    { href: '#contact',    de: 'Kontakt',     en: 'Contact' },
    { href: '#reservation',de: 'Reservieren', en: 'Reserve' },
  ]

  return (
    <div className={`mobile-menu${open ? ' open' : ''}`} id="mobileMenu">
      {links.map((l) => (
        <a key={l.href} href={l.href} onClick={onClose}>
          {t(l.de, l.en)}
        </a>
      ))}
    </div>
  )
}
