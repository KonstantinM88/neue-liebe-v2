'use client'

import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { useLang } from '@/context/LangContext'
import { STATIC_MENU_CATEGORIES, STATIC_MENU_DISHES } from '@/lib/menu-static'
import type { MenuCategory, MenuDish } from '@/lib/menu-types'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import TiltCard from '@/components/ui/TiltCard'

type MenuResponse = {
  categories?: MenuCategory[]
  dishes?: MenuDish[]
}

type CategoryKey = 'all' | string
type MenuSectionProps = {
  initialCategories?: MenuCategory[]
  initialDishes?: MenuDish[]
  loadRemoteOnInView?: boolean
}

const ALL_FILTER: MenuCategory & { key: 'all' } = {
  key: 'all',
  de: 'Alle',
  en: 'All',
}

function MenuDishMedia({ dish, playLabel, stopLabel, alt, tag, activeVideoId, setActiveVideoId }: {
  dish: MenuDish
  playLabel: string
  stopLabel: string
  alt: string
  tag: string
  activeVideoId: string | null
  setActiveVideoId: Dispatch<SetStateAction<string | null>>
}) {
  const isPlaying = activeVideoId === dish.id
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!isPlaying) return
    const video = videoRef.current
    if (!video) return
    let cancelled = false
    void video.play().catch(() => {
      if (!cancelled) {
        setActiveVideoId((current) => current === dish.id ? null : current)
      }
    })
    return () => {
      cancelled = true
      video.pause()
    }
  }, [dish.id, isPlaying, setActiveVideoId])

  return (
    <div className="menu-img">
      {dish.video && isPlaying ? (
        <video
          ref={videoRef}
          src={dish.video}
          poster={dish.imgDesktop}
          muted
          loop
          playsInline
          preload="none"
          onError={() => setActiveVideoId((current) => current === dish.id ? null : current)}
        />
      ) : (
        <picture>
          <source media="(max-width: 768px)" srcSet={dish.imgMobile} />
          <img src={dish.imgDesktop} alt={alt} loading="lazy" decoding="async" />
        </picture>
      )}
      {dish.video && (
        <button
          className="menu-video-toggle"
          type="button"
          aria-label={isPlaying ? stopLabel : playLabel}
          aria-pressed={isPlaying}
          onClick={() => setActiveVideoId((current) => current === dish.id ? null : dish.id)}
        />
      )}
      <div className="menu-tag">{tag}</div>
    </div>
  )
}

export default function MenuSection({
  initialCategories = STATIC_MENU_CATEGORIES,
  initialDishes = STATIC_MENU_DISHES,
  loadRemoteOnInView = true,
}: MenuSectionProps) {
  const { t } = useLang()
  const [active, setActive] = useState<CategoryKey>('all')
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories)
  const [dishes, setDishes] = useState<MenuDish[]>(initialDishes)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const { ref: sectionRef, isInView: shouldLoadRemoteMenu } = useInViewOnce<HTMLElement>('420px 0px')

  useEffect(() => {
    setCategories(initialCategories)
    setDishes(initialDishes)
  }, [initialCategories, initialDishes])

  useEffect(() => {
    if (!loadRemoteOnInView || !shouldLoadRemoteMenu) return

    let isCancelled = false

    async function loadMenu() {
      try {
        const response = await fetch('/api/menu')
        if (!response.ok) return
        const payload = (await response.json().catch(() => ({}))) as MenuResponse
        if (isCancelled) return

        if (Array.isArray(payload.categories) && payload.categories.length > 0) {
          setCategories(payload.categories)
        }
        if (Array.isArray(payload.dishes) && payload.dishes.length > 0) {
          setDishes(payload.dishes)
        }
      } catch (error) {
        console.error('[MenuSection] Failed to load menu', error)
      }
    }

    void loadMenu()
    return () => {
      isCancelled = true
    }
  }, [loadRemoteOnInView, shouldLoadRemoteMenu])

  useEffect(() => {
    if (active === 'all') return
    if (!categories.some((category) => category.key === active)) {
      setActive('all')
    }
  }, [active, categories])

  const filters = useMemo(() => [ALL_FILTER, ...categories], [categories])

  const filteredDishes = useMemo(
    () => (active === 'all' ? dishes : dishes.filter((dish) => dish.category === active)),
    [active, dishes]
  )

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const targets = Array.from(grid.querySelectorAll<HTMLElement>('.reveal'))
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12 }
    )

    targets.forEach((target) => observer.observe(target))

    requestAnimationFrame(() => {
      targets.forEach((target) => {
        const rect = target.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          target.classList.add('visible')
        }
      })
    })

    return () => observer.disconnect()
  }, [active, filteredDishes.length])

  return (
    <section id="menu" ref={loadRemoteOnInView ? sectionRef : undefined}>
      <div
        className="section-header-center reveal"
        style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 3rem' }}
      >
        <p className="section-label" style={{ color: 'var(--gold)' }}>
          {t('Aus unserer Küche', 'From Our Kitchen')}
        </p>
        <h2
          className="section-title"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: 'var(--charcoal)' }}
        >
          {t('Unsere Speisekarte', 'Our Menu')}
        </h2>
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--brown-light)',
            marginTop: '1rem',
            fontWeight: 300,
            lineHeight: 1.7,
          }}
        >
          {t(
            'Vorspeisen, Hauptgerichte, herzhafte Klassiker, Burger, Steaks und Begleiter zum Bier aus der Neuen Liebe.',
            'Starters, main courses, hearty classics, burgers, steaks and beer-friendly favorites from Neue Liebe.'
          )}
        </p>
      </div>

      <div
        className="menu-filter reveal"
        role="toolbar"
        aria-label={t('Menükategorien', 'Menu categories')}
      >
        {filters.map((filter) => (
          <button
            key={filter.key}
            className={`filter-btn${active === filter.key ? ' active' : ''}`}
            onClick={() => {
              setActive(filter.key)
              setActiveVideoId(null)
            }}
            type="button"
            data-active={active === filter.key ? 'true' : 'false'}
            aria-pressed={active === filter.key}
            aria-controls="menu-grid"
          >
            {t(filter.de, filter.en)}
          </button>
        ))}
      </div>

      <div
        id="menu-grid"
        className="menu-grid"
        ref={gridRef}
        style={{ paddingBottom: 'clamp(5rem, 10vw, 10rem)' }}
      >
        {filteredDishes.map((dish, index) => (
          <TiltCard
            as="article"
            key={dish.id}
            className="menu-card reveal"
            style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
          >
            <MenuDishMedia
              dish={dish}
              alt={t(dish.nameDe, dish.nameEn)}
              tag={t(dish.tagDe, dish.tagEn)}
              playLabel={t(`Video zu ${dish.nameDe} abspielen`, `Play video for ${dish.nameEn}`)}
              stopLabel={t(`Video zu ${dish.nameDe} anhalten`, `Stop video for ${dish.nameEn}`)}
              activeVideoId={activeVideoId}
              setActiveVideoId={setActiveVideoId}
            />

            <div className="menu-body">
              <div className="menu-name">{t(dish.nameDe, dish.nameEn)}</div>
              <div className="menu-desc">{t(dish.descDe, dish.descEn)}</div>
              <div className="menu-footer">
                <span className="menu-price">{dish.price}</span>
                <span className="menu-add" aria-hidden="true">+</span>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  )
}
