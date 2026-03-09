'use client'

import { useEffect, useRef, useState } from 'react'
import { useLang } from '@/context/LangContext'

type Category =
  | 'all'
  | 'klassiker'
  | 'pfanne-burger'
  | 'steaks-medaillons'
  | 'zum-bier'
  | 'bier-drinks'

type DishCategory = Exclude<Category, 'all'>

interface Dish {
  id: string
  imgDesktop: string
  imgMobile: string
  tagDe: string
  tagEn: string
  nameDe: string
  nameEn: string
  descDe: string
  descEn: string
  price: string
  category: DishCategory
}

const dishes: Dish[] = [
  {
    id: 'bauernfruehstueck',
    imgDesktop: '/bauernfruhstuck_desktop_1600x1200.webp',
    imgMobile: '/bauernfruhstuck_mobile_900.webp',
    tagDe: 'Klassiker',
    tagEn: 'Classic',
    nameDe: 'Bauernfrühstück',
    nameEn: "Farmer's Breakfast",
    descDe: 'Serviert mit Rohkostsalat und Gewürzgurke.',
    descEn: 'Served with fresh salad and pickled cucumber.',
    price: '12,50€',
    category: 'klassiker',
  },
  {
    id: 'strammer-max',
    imgDesktop: '/strammer_max_desktop_1600x1200.webp',
    imgMobile: '/strammer_max_mobile_900.webp',
    tagDe: 'Klassiker',
    tagEn: 'Classic',
    nameDe: 'Strammer Max',
    nameEn: 'Strammer Max',
    descDe: 'Schwarzbrot mit Schinken, zwei Spiegeleiern, Rohkostsalat und Gewürzgurke.',
    descEn: 'Dark bread with ham, two fried eggs, fresh salad and pickled cucumber.',
    price: '9,50€',
    category: 'klassiker',
  },
  {
    id: 'backfisch',
    imgDesktop: '/backfisch_desktop_1600x1200.webp',
    imgMobile: '/backfisch_mobile_900.webp',
    tagDe: 'Klassiker',
    tagEn: 'Classic',
    nameDe: 'Backfisch',
    nameEn: 'Fried Fish',
    descDe: 'Serviert mit hausgemachter Remoulade und Bratkartoffeln.',
    descEn: 'Served with homemade remoulade and fried potatoes.',
    price: '13,50€',
    category: 'klassiker',
  },
  {
    id: 'geschnetzeltes',
    imgDesktop: '/geschnetzeltes_desktop_1600x1200.webp',
    imgMobile: '/geschnetzeltes_mobile_900.webp',
    tagDe: 'Pfanne & Burger',
    tagEn: 'Skillet & Burger',
    nameDe: 'Geschnetzeltes',
    nameEn: 'Sliced Chicken in Cream Sauce',
    descDe: 'Zarte Hähnchenbruststreifen mit cremigen Champignons, serviert mit Kroketten.',
    descEn: 'Tender chicken breast strips with creamy mushrooms, served with croquettes.',
    price: '18,50€',
    category: 'pfanne-burger',
  },
  {
    id: 'burger-st-georg',
    imgDesktop: '/burger_st_georg_desktop_1600x1200.webp',
    imgMobile: '/burger_st_georg_mobile_900.webp',
    tagDe: 'Pfanne & Burger',
    tagEn: 'Skillet & Burger',
    nameDe: 'Burger "St. Georg"',
    nameEn: 'Burger "St. George"',
    descDe: 'Saftiger Rindfleisch-Burger mit Bacon, Spiegelei, Weißkrautsalat, BBQ-Sauce, Gewürzgurke und Schmorzwiebeln, serviert mit Pommes.',
    descEn: 'Juicy beef burger with bacon, fried egg, cabbage slaw, BBQ sauce, pickled cucumber and braised onions, served with fries.',
    price: '19,50€',
    category: 'pfanne-burger',
  },
  {
    id: 'nebraer-biersteak',
    imgDesktop: '/nebraer_biersteak_desktop_1600x1200.webp',
    imgMobile: '/nebraer_biersteak_mobile_900.webp',
    tagDe: 'Steaks & Medaillons',
    tagEn: 'Steaks & Medallions',
    nameDe: 'Nebraer-Biersteak',
    nameEn: 'Nebra Beer Steak',
    descDe: 'Gebratenes Schweinenackensteak mit Schmorzwiebeln, mit Nebraer Bier abgelöscht und mit Bratkartoffeln serviert.',
    descEn: 'Roasted pork neck steak with braised onions, finished with Nebra beer and served with fried potatoes.',
    price: '18,50€',
    category: 'steaks-medaillons',
  },
  {
    id: 'schweinemedaillons',
    imgDesktop: '/schweinemedaillons_desktop_1600x1200.webp',
    imgMobile: '/schweinemedaillons_mobile_900.webp',
    tagDe: 'Steaks & Medaillons',
    tagEn: 'Steaks & Medallions',
    nameDe: 'Zarte Schweinemedaillons',
    nameEn: 'Tender Pork Medallions',
    descDe: 'Serviert mit cremigen Pilzen und Kroketten.',
    descEn: 'Served with creamy mushrooms and croquettes.',
    price: '19,50€',
    category: 'steaks-medaillons',
  },
  {
    id: 'zigeuner-steak',
    imgDesktop: '/zigeuner_steak_desktop_1600x1200.webp',
    imgMobile: '/zigeuner_steak_mobile_900.webp',
    tagDe: 'Steaks & Medaillons',
    tagEn: 'Steaks & Medallions',
    nameDe: '"Zigeuner-Steak"',
    nameEn: '"Zigeuner Steak"',
    descDe: 'Saftig gebratenes Schweinenackensteak mit kräftiger Paprikagemüse-Sauce und Pommes.',
    descEn: 'Juicy pork neck steak with bold pepper vegetable sauce and fries.',
    price: '18,50€',
    category: 'steaks-medaillons',
  },
  {
    id: 'bierbrett-neue-liebe',
    imgDesktop: '/german_snacks_desktop.webp',
    imgMobile: '/german_snacks_mobile.webp',
    tagDe: 'Zum Bier',
    tagEn: 'For Beer',
    nameDe: 'Bierbrett Neue Liebe',
    nameEn: 'Neue Liebe Beer Board',
    descDe: 'Kleine Auswahl aus Kaminwurst, Käsewürfeln, Gewürzgurken und kräftigem Landbrot.',
    descEn: 'A small selection of smoked sausage, cheese cubes, pickles and hearty country bread.',
    price: '12,90€',
    category: 'zum-bier',
  },
  {
    id: 'brezelknusper-obazda',
    imgDesktop: '/german_snacks_desktop.webp',
    imgMobile: '/german_snacks_mobile.webp',
    tagDe: 'Zum Bier',
    tagEn: 'For Beer',
    nameDe: 'Brezelknusper mit Obazda',
    nameEn: 'Pretzel Crisps with Obazda',
    descDe: 'Warme Laugenbissen mit cremigem Bierkäse-Dip und roten Zwiebeln.',
    descEn: 'Warm pretzel bites with creamy beer cheese dip and red onions.',
    price: '6,90€',
    category: 'zum-bier',
  },
  {
    id: 'paprika-kartoffelecken',
    imgDesktop: '/german_snacks_desktop.webp',
    imgMobile: '/german_snacks_mobile.webp',
    tagDe: 'Zum Bier',
    tagEn: 'For Beer',
    nameDe: 'Paprika-Kartoffelecken',
    nameEn: 'Paprika Potato Wedges',
    descDe: 'Knusprige Kartoffelecken mit Rauchpaprika und milder Kräutercreme.',
    descEn: 'Crispy potato wedges with smoked paprika and mild herb cream.',
    price: '7,50€',
    category: 'zum-bier',
  },
  {
    id: 'nebraer-bier-st-georg',
    imgDesktop: '/kostritzer_desktop.webp',
    imgMobile: '/kostritzer_mobile.webp',
    tagDe: 'Bier & Drinks',
    tagEn: 'Beer & Drinks',
    nameDe: '"Nebraer Bier" St. Georg',
    nameEn: '"Nebra Beer" St. George',
    descDe: 'Feinmilde Bierspezialität mit malzig-süßem, vollmundigem Geschmack. 0,5L.',
    descEn: 'A smooth beer specialty with malty-sweet, full-bodied flavor. 0.5L.',
    price: '4,50€',
    category: 'bier-drinks',
  },
  {
    id: 'koestritzer-schwarzbier',
    imgDesktop: '/kostritzer_desktop.webp',
    imgMobile: '/kostritzer_mobile.webp',
    tagDe: 'Bier & Drinks',
    tagEn: 'Beer & Drinks',
    nameDe: 'Köstritzer Schwarzbier',
    nameEn: 'Köstritzer Dark Beer',
    descDe: 'Herb-fein mit röstigen Malznoten und eleganter Tiefe. 0,5L.',
    descEn: 'Delicately bitter with roasted malt notes and elegant depth. 0.5L.',
    price: '4,80€',
    category: 'bier-drinks',
  },
  {
    id: 'keller-radler',
    imgDesktop: '/kostritzer_desktop.webp',
    imgMobile: '/kostritzer_mobile.webp',
    tagDe: 'Bier & Drinks',
    tagEn: 'Beer & Drinks',
    nameDe: 'Keller-Radler',
    nameEn: 'Cellar Radler',
    descDe: 'Erfrischend gemischt, leicht, spritzig und ideal zum Essen. 0,5L.',
    descEn: 'Refreshingly mixed, light, sparkling and ideal with food. 0.5L.',
    price: '4,60€',
    category: 'bier-drinks',
  },
  {
    id: 'hausgemachte-limonade',
    imgDesktop: '/kostritzer_desktop.webp',
    imgMobile: '/kostritzer_mobile.webp',
    tagDe: 'Bier & Drinks',
    tagEn: 'Beer & Drinks',
    nameDe: 'Hausgemachte Limonade',
    nameEn: 'Homemade Lemonade',
    descDe: 'Zitrone, Minze und kühler Sprudel mit frischer Note. 0,4L.',
    descEn: 'Lemon, mint and cool sparkling water with a fresh finish. 0.4L.',
    price: '4,90€',
    category: 'bier-drinks',
  },
]

const filters: { key: Category; de: string; en: string }[] = [
  { key: 'all', de: 'Alle', en: 'All' },
  { key: 'klassiker', de: 'Klassiker', en: 'Classics' },
  { key: 'pfanne-burger', de: 'Pfanne & Burger', en: 'Skillet & Burger' },
  { key: 'steaks-medaillons', de: 'Steaks & Medaillons', en: 'Steaks & Medallions' },
  { key: 'zum-bier', de: 'Zum Bier', en: 'For Beer' },
  { key: 'bier-drinks', de: 'Bier & Drinks', en: 'Beer & Drinks' },
]

export default function MenuSection() {
  const { t } = useLang()
  const [active, setActive] = useState<Category>('all')
  const gridRef = useRef<HTMLDivElement | null>(null)

  const filteredDishes = active === 'all'
    ? dishes
    : dishes.filter((dish) => dish.category === active)

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
  }, [active])

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
            'Herzhafte Klassiker, Burger, Steaks und Begleiter zum Bier aus der Neuen Liebe.',
            'Hearty classics, burgers, steaks and beer-friendly favorites from Neue Liebe.'
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
