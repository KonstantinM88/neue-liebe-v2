import type { GalleryPhoto } from '@/lib/gallery-types'
import type { MenuCategory, MenuDish } from '@/lib/menu-types'
import type { SiteLocale } from '@/lib/site-locale'

const SITE_URL = 'https://www.neueliebe-nebra.de'
const WEBSITE_ID = `${SITE_URL}#website`
const RESTAURANT_ID = `${SITE_URL}#restaurant`
const DEFAULT_IMAGE_URL = `${SITE_URL}/cafe_interior_800x600_optimized.webp`
const SECONDARY_IMAGE_URL = `${SITE_URL}/events2_1200.webp`
const RESTAURANT_PHONE = '+49 34461 599804'
const RESTAURANT_ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: 'Wetzendorfer Str. 10',
  postalCode: '06642',
  addressLocality: 'Nebra (Unstrut)',
  addressCountry: 'DE',
}

function getInLanguage(locale: SiteLocale): 'de-DE' | 'en-US' {
  return locale === 'de' ? 'de-DE' : 'en-US'
}

function buildWebsiteEntity(locale: SiteLocale, description: string) {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: 'Neue Liebe',
    inLanguage: getInLanguage(locale),
    description,
    publisher: { '@id': RESTAURANT_ID },
  }
}

function buildRestaurantEntity(locale: SiteLocale, description: string) {
  const isEnglish = locale === 'en'

  return {
    '@type': 'Restaurant',
    '@id': RESTAURANT_ID,
    name: 'Neue Liebe',
    url: SITE_URL,
    image: [
      DEFAULT_IMAGE_URL,
      SECONDARY_IMAGE_URL,
      `${SITE_URL}/terrace_1200.webp`,
    ],
    description,
    telephone: RESTAURANT_PHONE,
    priceRange: '20-30 EUR',
    servesCuisine: isEnglish
      ? ['Regional cuisine', 'German cuisine', 'Burgers', 'Steaks']
      : ['Regionale Küche', 'Deutsche Küche', 'Burger', 'Steaks'],
    address: RESTAURANT_ADDRESS,
    areaServed: isEnglish ? 'Saxony-Anhalt' : 'Sachsen-Anhalt',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Thursday', 'Friday', 'Saturday'],
        opens: '15:00',
        closes: '23:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    menu: locale === 'de' ? `${SITE_URL}/menu` : `${SITE_URL}/en/menu`,
    acceptsReservations: 'True',
  }
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }

  return `${SITE_URL}${pathOrUrl}`
}

function parseEuroPrice(value: string): string | undefined {
  const normalized = value.replace(/[^\d,.-]/g, '').replace(',', '.')

  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return undefined
  }

  return normalized
}

export function buildHomeStructuredData(locale: SiteLocale, pageUrl: string) {
  const isEnglish = locale === 'en'
  const pageName = isEnglish
    ? 'Neue Liebe | Restaurant • Terrace • Dance & Events'
    : 'Neue Liebe – Restaurant • Terrasse • Tanz & Events'
  const description = isEnglish
    ? 'Neue Liebe restaurant in Nebra (Unstrut): regional cuisine, elegant terrace, dance evenings and special events in Saxony-Anhalt.'
    : 'Restaurant Neue Liebe in Nebra (Unstrut): regionale Küche, stilvolle Terrasse, Tanzabende und besondere Events in Sachsen-Anhalt.'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(locale, description),
      buildRestaurantEntity(locale, description),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageName,
        description,
        inLanguage: getInLanguage(locale),
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': RESTAURANT_ID },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: DEFAULT_IMAGE_URL,
        },
      },
    ],
  }
}

export function buildEventsStructuredData(locale: SiteLocale, pageUrl: string) {
  const isEnglish = locale === 'en'
  const pageName = 'Events | Neue Liebe'
  const description = isEnglish
    ? 'Weddings, corporate events and dance evenings at Neue Liebe in Nebra (Unstrut) with stylish spaces and fitting cuisine.'
    : 'Hochzeiten, Firmenfeiern und Tanzabende in der Neuen Liebe in Nebra (Unstrut) mit stilvollen Räumen und passender Kulinarik.'
  const eventFormats = [
    {
      name: isEnglish ? 'Weddings' : 'Hochzeiten',
      description: isEnglish
        ? 'Atmospheric wedding celebrations with hospitality and cuisine.'
        : 'Stimmungsvolle Hochzeitsfeiern mit Gastlichkeit und Kulinarik.',
    },
    {
      name: isEnglish ? 'Corporate Events' : 'Firmenfeiern',
      description: isEnglish
        ? 'Corporate dinners, team evenings and business celebrations.'
        : 'Firmenessen, Teamabende und geschäftliche Feiern.',
    },
    {
      name: isEnglish ? 'Dance Evenings' : 'Tanzabende',
      description: isEnglish
        ? 'Dance and music evenings with a lively atmosphere.'
        : 'Abende mit Tanz, Musik und besonderer Atmosphäre.',
    },
  ]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(locale, description),
      buildRestaurantEntity(locale, description),
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageName,
        description,
        inLanguage: getInLanguage(locale),
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': RESTAURANT_ID },
        mainEntity: { '@id': `${pageUrl}#venue` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: SECONDARY_IMAGE_URL,
        },
      },
      {
        '@type': 'EventVenue',
        '@id': `${pageUrl}#venue`,
        name: pageName,
        description,
        url: pageUrl,
        inLanguage: getInLanguage(locale),
        image: [
          SECONDARY_IMAGE_URL,
          `${SITE_URL}/hochzeit_restaurant_desktop_1600x1200.webp`,
          `${SITE_URL}/firmen_1200.webp`,
        ],
        address: RESTAURANT_ADDRESS,
        telephone: RESTAURANT_PHONE,
        containedInPlace: { '@id': RESTAURANT_ID },
        areaServed: isEnglish ? 'Saxony-Anhalt' : 'Sachsen-Anhalt',
        amenityFeature: eventFormats.map((format) => ({
          '@type': 'LocationFeatureSpecification',
          name: format.name,
          value: true,
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#event-formats`,
        name: isEnglish ? 'Event Formats' : 'Eventformate',
        numberOfItems: eventFormats.length,
        itemListElement: eventFormats.map((format, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Thing',
            name: format.name,
            description: format.description,
          },
        })),
      },
    ],
  }
}

export function buildMenuStructuredData(
  locale: SiteLocale,
  pageUrl: string,
  categories: MenuCategory[],
  dishes: MenuDish[]
) {
  const isEnglish = locale === 'en'
  const pageName = isEnglish ? 'Menu | Neue Liebe' : 'Speisekarte | Neue Liebe'
  const description = isEnglish
    ? 'Neue Liebe menu in Nebra (Unstrut) with starters, main courses, classics, burgers, steaks and drinks.'
    : 'Speisekarte der Neuen Liebe in Nebra (Unstrut) mit Vorspeisen, Hauptgerichten, Klassikern, Burgern, Steaks und Drinks.'

  const menuItems = dishes.map((dish) => {
    const itemId = `${pageUrl}#menu-item-${dish.id}`
    const price = parseEuroPrice(dish.price)

    return {
      '@type': 'MenuItem',
      '@id': itemId,
      name: isEnglish ? dish.nameEn : dish.nameDe,
      description: isEnglish ? dish.descEn : dish.descDe,
      image: [
        toAbsoluteUrl(dish.imgDesktop),
        toAbsoluteUrl(dish.imgMobile),
      ],
      offers: price
        ? {
            '@type': 'Offer',
            price,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
          }
        : undefined,
    }
  })

  const menuSections = categories
    .map((category) => {
      const categoryDishes = dishes.filter((dish) => dish.category === category.key)

      if (categoryDishes.length === 0) {
        return null
      }

      return {
        '@type': 'MenuSection',
        '@id': `${pageUrl}#menu-section-${category.key}`,
        name: isEnglish ? category.en : category.de,
        hasMenuItem: categoryDishes.map((dish) => ({
          '@id': `${pageUrl}#menu-item-${dish.id}`,
        })),
      }
    })
    .filter((section): section is NonNullable<typeof section> => section !== null)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageName,
        description,
        inLanguage: getInLanguage(locale),
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': RESTAURANT_ID },
        mainEntity: { '@id': `${pageUrl}#menu` },
      },
      {
        '@type': 'Menu',
        '@id': `${pageUrl}#menu`,
        name: pageName,
        description,
        inLanguage: getInLanguage(locale),
        hasMenuSection: menuSections.map((section) => ({
          '@id': section['@id'],
        })),
      },
      ...menuSections,
      ...menuItems,
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#item-list`,
        name: isEnglish ? 'Menu Items' : 'Gerichte',
        numberOfItems: menuItems.length,
        itemListElement: dishes.map((dish, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: { '@id': `${pageUrl}#menu-item-${dish.id}` },
        })),
      },
    ],
  }
}

export function buildGalleryStructuredData(
  locale: SiteLocale,
  pageUrl: string,
  photos: GalleryPhoto[]
) {
  const isEnglish = locale === 'en'
  const pageName = isEnglish ? 'Gallery | Neue Liebe' : 'Galerie | Neue Liebe'
  const description = isEnglish
    ? 'Gallery with impressions from the restaurant, cuisine, terrace and events at Neue Liebe.'
    : 'Galerie mit Eindrücken aus Restaurant, Küche, Terrasse und Events der Neuen Liebe.'
  const imageObjects = photos.map((photo, index) => ({
    '@type': 'ImageObject',
    '@id': `${pageUrl}#image-${index + 1}`,
    name: photo.alt,
    caption: photo.alt,
    keywords: photo.tag,
    contentUrl: toAbsoluteUrl(photo.desktop),
    thumbnailUrl: toAbsoluteUrl(photo.mobile),
    representativeOfPage: index === 0 || undefined,
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(locale, description),
      buildRestaurantEntity(locale, description),
      {
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageName,
        description,
        inLanguage: getInLanguage(locale),
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': RESTAURANT_ID },
        mainEntity: { '@id': `${pageUrl}#gallery` },
        primaryImageOfPage: { '@id': `${pageUrl}#image-1` },
      },
      {
        '@type': 'ImageGallery',
        '@id': `${pageUrl}#gallery`,
        name: pageName,
        description,
        inLanguage: getInLanguage(locale),
        about: { '@id': RESTAURANT_ID },
        hasPart: imageObjects.map((image) => ({
          '@id': image['@id'],
        })),
      },
      ...imageObjects,
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#gallery-items`,
        name: isEnglish ? 'Gallery Photos' : 'Galeriebilder',
        numberOfItems: imageObjects.length,
        itemListElement: imageObjects.map((image, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: { '@id': image['@id'] },
        })),
      },
    ],
  }
}

export function buildContactStructuredData(locale: SiteLocale, pageUrl: string) {
  const isEnglish = locale === 'en'
  const pageName = isEnglish ? 'Contact | Neue Liebe' : 'Kontakt | Neue Liebe'
  const description = isEnglish
    ? 'Contact details, address, opening hours and directions to Neue Liebe in Nebra (Unstrut).'
    : 'Kontakt, Adresse, Öffnungszeiten und Anfahrt zur Neuen Liebe in Nebra (Unstrut).'
  const contactPointId = `${pageUrl}#contact-point`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteEntity(locale, description),
      {
        ...buildRestaurantEntity(locale, description),
        contactPoint: { '@id': contactPointId },
      },
      {
        '@type': 'ContactPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageName,
        description,
        inLanguage: getInLanguage(locale),
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': RESTAURANT_ID },
        mainEntity: { '@id': contactPointId },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: DEFAULT_IMAGE_URL,
        },
      },
      {
        '@type': 'ContactPoint',
        '@id': contactPointId,
        telephone: RESTAURANT_PHONE,
        contactType: 'customer service',
        availableLanguage: ['de', 'en'],
        areaServed: 'DE',
        url: pageUrl,
      },
    ],
  }
}
