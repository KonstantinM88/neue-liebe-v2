'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useLang } from '@/context/LangContext'
import { STATIC_MENU_CATEGORIES, STATIC_MENU_DISHES } from '@/lib/menu-static'
import type { MenuCategory, MenuDish } from '@/lib/menu-types'
import { useInViewOnce } from '@/hooks/useInViewOnce'

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

const MENU_CARD_IMAGE_SIZES = '(max-width: 768px) 92vw, (max-width: 1100px) 46vw, 360px'

export default function MenuSection({
  initialCategories = STATIC_MENU_CATEGORIES,
  initialDishes = STATIC_MENU_DISHES,
  loadRemoteOnInView = true,
}: MenuSectionProps) {
  const { t } = useLang()
  const [active, setActive] = useState<CategoryKey>('all')
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories)
  const [dishes, setDishes] = useState<MenuDish[]>(initialDishes)
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
        style={{ paddingBottom: 'clamp(5rem, 10vw, 10rem)' }}
      >
        {filteredDishes.map((dish, index) => (
          <article
            key={dish.id}
            className="menu-card reveal"
            style={{ transitionDelay: `${(index % 3) * 0.1}s` }}
          >
            <div className="menu-img">
              <div className="menu-img-frame">
                <Image
                  src={dish.imgDesktop}
                  alt={t(dish.nameDe, dish.nameEn)}
                  width={1200}
                  height={900}
                  sizes={MENU_CARD_IMAGE_SIZES}
                  quality={68}
                  loading="lazy"
                  decoding="async"
                />
              </div>
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
