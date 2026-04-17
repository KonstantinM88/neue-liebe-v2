'use client'

import { useEffect, useState } from 'react'
import { LangProvider, type Lang } from '@/context/LangContext'

import Cursor from '@/components/Cursor'
import Footer from '@/components/Footer'
import MobileMenu from '@/components/MobileMenu'
import Navigation from '@/components/Navigation'
import ScrollProgress from '@/components/ScrollProgress'
import Toast from '@/components/Toast'

import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import Events from '@/components/sections/Events'
import Experience from '@/components/sections/Experience'
import Gallery from '@/components/sections/Gallery'
import Hero from '@/components/sections/Hero'
import InfoBar from '@/components/sections/InfoBar'
import MenuSection from '@/components/sections/MenuSection'
import ParallaxQuote from '@/components/sections/ParallaxQuote'
import Reservation from '@/components/sections/Reservation'
import Reviews from '@/components/sections/Reviews'

type HomePageClientProps = {
  initialLang?: Lang
}

export default function HomePageClient({ initialLang = 'de' }: HomePageClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState('')

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
      <Toast message={toast} onDone={() => setToast('')} />
    </LangProvider>
  )
}
