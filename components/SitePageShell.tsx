'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Cursor from '@/components/Cursor'
import Footer from '@/components/Footer'
import MobileMenu from '@/components/MobileMenu'
import Navigation from '@/components/Navigation'
import ScrollProgress from '@/components/ScrollProgress'
import { LangProvider, type Lang } from '@/context/LangContext'

type SitePageShellProps = {
  children: ReactNode
  initialLang?: Lang
}

export default function SitePageShell({
  children,
  initialLang = 'de',
}: SitePageShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-right')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible') }),
      { threshold: 0.12 }
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (window.location.hash) return
    const originalScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    resetScroll()
    const frame = requestAnimationFrame(resetScroll)
    const timeout = window.setTimeout(resetScroll, 120)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
      window.history.scrollRestoration = originalScrollRestoration
    }
  }, [pathname])

  return (
    <LangProvider initialLang={initialLang}>
      <Cursor />
      <ScrollProgress />

      <Navigation
        mobileOpen={mobileOpen}
        onHamburger={() => setMobileOpen((open) => !open)}
      />
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {children}
      <Footer />
    </LangProvider>
  )
}
