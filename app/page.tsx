'use client'

import { useState, useEffect } from 'react'
import { LangProvider } from '@/context/LangContext'

// Layout
import Cursor        from '@/components/Cursor'
import ScrollProgress from '@/components/ScrollProgress'
import Navigation    from '@/components/Navigation'
import MobileMenu    from '@/components/MobileMenu'
import Toast         from '@/components/Toast'
import Footer        from '@/components/Footer'

// Sections
import Hero          from '@/components/sections/Hero'
import InfoBar       from '@/components/sections/InfoBar'
import About         from '@/components/sections/About'
import Experience    from '@/components/sections/Experience'
import MenuSection   from '@/components/sections/MenuSection'
import ParallaxQuote from '@/components/sections/ParallaxQuote'
import Gallery       from '@/components/sections/Gallery'
import Events        from '@/components/sections/Events'
import Reviews       from '@/components/sections/Reviews'
import Reservation   from '@/components/sections/Reservation'
import Contact       from '@/components/sections/Contact'

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState('')

  // Attach global IntersectionObserver for reveal animations
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-right')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <LangProvider>
      {/* Utilities */}
      <Cursor />
      <ScrollProgress />

      {/* Navigation */}
      <Navigation
        mobileOpen={mobileOpen}
        onHamburger={() => setMobileOpen((o) => !o)}
      />
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Page sections */}
      <main>
        <Hero />
        <InfoBar />
        <About />
        <Experience />
        <MenuSection />
        <ParallaxQuote />
        <Gallery />
        <Events />
        <Reviews />
        <Reservation onToast={setToast} />
        <Contact />
      </main>

      <Footer />

      {/* Toast notification */}
      <Toast message={toast} onDone={() => setToast('')} />
    </LangProvider>
  )
}
