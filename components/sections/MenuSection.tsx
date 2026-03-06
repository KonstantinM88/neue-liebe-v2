'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useLang } from '@/context/LangContext'

type Category = 'all' | 'starter' | 'main' | 'dessert'

const dishes = [
  {
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    tagDe: 'Vorspeise', tagEn: 'Starter',
    nameDe: 'Saison-Salat', nameEn: 'Seasonal Salad',
    descDe: 'Frische Salatblätter mit Kirschtomaten, Walnüssen und Honig-Senf-Dressing.',
    descEn: 'Fresh lettuce with cherry tomatoes, walnuts and honey mustard dressing.',
    price: '9,50 €', category: 'starter' as Category,
  },
  {
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
    tagDe: 'Empfehlung', tagEn: "Chef's Pick",
    nameDe: 'Rinderfilet', nameEn: 'Beef Tenderloin',
    descDe: 'Zartes Rinderfilet mit Rotweinreduktion, Spargel und Kartoffelgratin.',
    descEn: 'Tender beef fillet with red wine reduction, asparagus and potato gratin.',
    price: '28,00 €', category: 'main' as Category,
  },
  {
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
    tagDe: 'Hauptgericht', tagEn: 'Main',
    nameDe: 'Gegrillter Lachs', nameEn: 'Grilled Salmon',
    descDe: 'Atlantischer Lachs auf Safrankartoffeln mit Beurre Blanc und frischen Kräutern.',
    descEn: 'Atlantic salmon on saffron potatoes with beurre blanc and fresh herbs.',
    price: '22,00 €', category: 'main' as Category,
  },
  {
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    tagDe: 'Vegetarisch', tagEn: 'Vegetarian',
    nameDe: 'Pilz-Risotto', nameEn: 'Mushroom Risotto',
    descDe: 'Cremiges Risotto mit wilden Waldpilzen, Parmesan und weißem Trüffelöl.',
    descEn: 'Creamy risotto with wild forest mushrooms, parmesan and white truffle oil.',
    price: '18,50 €', category: 'main' as Category,
  },
  {
    img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80',
    tagDe: 'Klassiker', tagEn: 'Classic',
    nameDe: 'Wiener Schnitzel', nameEn: 'Wiener Schnitzel',
    descDe: 'Hausgemachtes Kalbsschnitzel mit Kartoffelsalat und frischer Zitrone.',
    descEn: 'Homemade veal schnitzel with potato salad and fresh lemon.',
    price: '23,00 €', category: 'main' as Category,
  },
  {
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80',
    tagDe: 'Dessert', tagEn: 'Dessert',
    nameDe: 'Schokoladen-Fondant', nameEn: 'Chocolate Fondant',
    descDe: 'Warmer Schokoladenkuchen mit flüssigem Kern, Vanilleeis und Himbeeren.',
    descEn: 'Warm chocolate cake with liquid center, vanilla ice cream and raspberries.',
    price: '9,00 €', category: 'dessert' as Category,
  },
]

export default function MenuSection() {
  const { t } = useLang()
  const [active, setActive] = useState<Category>('all')

  const filtered = active === 'all' ? dishes : dishes.filter((d) => d.category === active)

  const filters: { key: Category; de: string; en: string }[] = [
    { key: 'all',     de: 'Alle',          en: 'All' },
    { key: 'starter', de: 'Vorspeisen',    en: 'Starters' },
    { key: 'main',    de: 'Hauptgerichte', en: 'Main Courses' },
    { key: 'dessert', de: 'Desserts',      en: 'Desserts' },
  ]

  return (
    <section id="menu">
      <div className="section-header-center reveal" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 3rem', paddingTop: 'clamp(5rem, 10vw, 10rem)' }}>
        <p className="section-label" style={{ color: 'var(--gold)' }}>
          {t('Unsere Küche', 'Our Cuisine')}
        </p>
        <h2 className="section-title" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: 'var(--charcoal)' }}>
          {t('Signature Gerichte', 'Signature Dishes')}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--brown-light)', marginTop: '1rem', fontWeight: 300 }}>
          {t('Frische, regionale Zutaten – täglich mit Leidenschaft zubereitet.', 'Fresh, regional ingredients – prepared daily with passion.')}
        </p>
      </div>

      {/* Filter */}
      <div className="menu-filter reveal">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`filter-btn${active === f.key ? ' active' : ''}`}
            onClick={() => setActive(f.key)}
          >
            {t(f.de, f.en)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="menu-grid" style={{ paddingBottom: 'clamp(5rem, 10vw, 10rem)' }}>
        {filtered.map((d, i) => (
          <div key={i} className="menu-card reveal" style={{ transitionDelay: `${(i % 3) * 0.1}s` }}>
            <div className="menu-img">
              <Image
                src={d.img}
                alt={t(d.nameDe, d.nameEn)}
                width={600}
                height={450}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block', aspectRatio: '4/3' }}
              />
              <div className="menu-tag">{t(d.tagDe, d.tagEn)}</div>
            </div>
            <div className="menu-body">
              <div className="menu-name">{t(d.nameDe, d.nameEn)}</div>
              <div className="menu-desc">{t(d.descDe, d.descEn)}</div>
              <div className="menu-footer">
                <span className="menu-price">{d.price}</span>
                <button className="menu-add" aria-label="Add to order">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
