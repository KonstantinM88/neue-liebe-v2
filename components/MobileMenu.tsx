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
    const isHashNavigation = href.includes('#')

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
      router.push(href, { scroll: !isHashNavigation })

      if (!isHashNavigation) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
          document.documentElement.scrollTop = 0
          document.body.scrollTop = 0
        })
      }

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
          <span className="mobile-menu-anchor" aria-hidden="true">
            <svg viewBox="0 0 32 32" role="presentation" focusable="false">
              <circle cx="16" cy="4.75" r="2.25" fill="currentColor" />
              <path
                d="M16 8v14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
              <path
                d="M10 12h12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
              <path
                d="M8.25 20.25c0 4.2 3.45 7.1 7.75 7.1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
              <path
                d="M23.75 20.25c0 4.2-3.45 7.1-7.75 7.1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
              <path
                d="M8.75 19.5l-3.15 2.85"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
              <path
                d="M23.25 19.5l3.15 2.85"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
              <path
                d="M13.75 27.35h4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  )
}
