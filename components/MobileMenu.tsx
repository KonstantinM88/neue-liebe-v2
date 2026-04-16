'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import { getReservationHref, PRIMARY_NAV_ITEMS, resolveSiteHref } from '@/lib/site-nav'

interface Props {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: Props) {
  const { t } = useLang()
  const pathname = usePathname()
  const links = [
    ...PRIMARY_NAV_ITEMS,
    { key: 'reservation', de: 'Reservieren', en: 'Reserve' },
  ]

  return (
    <div className={`mobile-menu${open ? ' open' : ''}`} id="mobileMenu">
      <div className="mobile-menu-links">
        {links.map((item) => (
          <Link
            key={item.key}
            href={item.key === 'reservation' ? getReservationHref(pathname) : resolveSiteHref(pathname, item)}
            onClick={onClose}
          >
            {t(item.de, item.en)}
          </Link>
        ))}
      </div>
      
      <div className="mobile-menu-logo">
        <Link href="/" onClick={onClose} aria-label="Home">
          N
        </Link>
      </div>
    </div>
  )
}
