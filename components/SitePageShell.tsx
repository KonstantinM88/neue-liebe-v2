'use client'

import { useEffect, useState, type ReactNode } from 'react'
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

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-right')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible') }),
      { threshold: 0.12 }
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

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
