'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLang } from '@/context/LangContext'
import { STATIC_MENU_CATEGORIES, STATIC_MENU_DISHES } from '@/lib/menu-static'
import type { MenuCategory, MenuDish } from '@/lib/menu-types'

type MenuResponse = {
  categories?: MenuCategory[]
  dishes?: MenuDish[]
}

type CategoryKey = 'all' | string

const ALL_FILTER: MenuCategory & { key: 'all' } = {
  key: 'all',
  de: 'Alle',
  en: 'All',
}

export default function MenuSection() {
  const { t } = useLang()
  const [active, setActive] = useState<CategoryKey>('all')
  const [categories, setCategories] = useState<MenuCategory[]>(STATIC_MENU_CATEGORIES)
  const [dishes, setDishes] = useState<MenuDish[]>(STATIC_MENU_DISHES)
  const gridRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadMenu() {
      try {
        const response = await fetch('/api/menu', { cache: 'no-store' })
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
  }, [])

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
    <section id="menu">
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
            onClick={() => setActive(filter.key)}
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
          <article
            key={dish.id}
            className="menu-card reveal"
            style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
          >
            <div className="menu-img">
              <picture>
                <source media="(max-width: 768px)" srcSet={dish.imgMobile} />
                <img
                  src={dish.imgDesktop}
                  alt={t(dish.nameDe, dish.nameEn)}
                  loading="lazy"
                />
              </picture>
              <div className="menu-tag">{t(dish.tagDe, dish.tagEn)}</div>
            </div>

            <div className="menu-body">
              <div className="menu-name">{t(dish.nameDe, dish.nameEn)}</div>
              <div className="menu-desc">{t(dish.descDe, dish.descEn)}</div>
              <div className="menu-footer">
                <span className="menu-price">{dish.price}</span>
                <span className="menu-add" aria-hidden="true">+</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
