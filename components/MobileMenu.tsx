'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLang } from '@/context/LangContext'
import { getReservationHref, PRIMARY_NAV_ITEMS, resolveSiteHref } from '@/lib/site-nav'

interface Props {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: Props) {
  const { t } = useLang()
  const pathname = usePathname()
  const router = useRouter()
  const [navigatingKey, setNavigatingKey] = useState<string | null>(null)

  const links = [
    ...PRIMARY_NAV_ITEMS,
    { key: 'reservation', de: 'Reservieren', en: 'Reserve' },
  ]

  const handleNavigate = (e: React.MouseEvent<HTMLAnchorElement>, href: string, key: string) => {
    // If we're already on the same page, just close the menu
    if (pathname === href) {
      onClose()
      return
    }
    // Prevent immediate navigation
    e.preventDefault()
    // Trigger animation state
    setNavigatingKey(key)
    
    // Wait for the .animate-click animation to finish (400ms)
    setTimeout(() => {
      router.push(href)
      onClose()
      // Cleanup state after menu slides out
      setTimeout(() => setNavigatingKey(null), 400)
    }, 350)
  }

  return (
    <div className={`mobile-menu${open ? ' open' : ''}`} id="mobileMenu">
      <div className="mobile-menu-links">
        {links.map((item) => {
          const href = item.key === 'reservation' ? getReservationHref(pathname) : resolveSiteHref(pathname, item)
          return (
            <Link
              key={item.key}
              href={href}
              onClick={(e) => handleNavigate(e, href, item.key)}
              className={navigatingKey === item.key ? 'animate-click' : ''}
            >
              {t(item.de, item.en)}
            </Link>
          )
        })}
      </div>
      
      <div className="mobile-menu-logo">
        <Link 
          href="/" 
          onClick={(e) => handleNavigate(e, '/', 'logo')} 
          aria-label="Home"
          className={navigatingKey === 'logo' ? 'animate-click' : ''}
        >
          N
        </Link>
      </div>
    </div>
  )
}
