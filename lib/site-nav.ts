import { buildLocalizedPath, getHomeSectionHref, getPathLocale, type SiteAnchor, type SiteLocale, type SitePath, stripLocalePrefix } from '@/lib/site-locale'

export type SiteNavItem = {
  key: string
  de: string
  en: string
  homeAnchor?: SiteAnchor
  pageHref?: Record<'de', SitePath> & Partial<Record<Exclude<SiteLocale, 'de'>, SitePath>>
}

export const PRIMARY_NAV_ITEMS: SiteNavItem[] = [
  { key: 'about', de: 'Über uns', en: 'About', pageHref: { de: '/about', en: '/en/about' } },
  { key: 'experience', de: 'Erlebnisse', en: 'Experiences', pageHref: { de: '/experience', en: '/en/experience' } },
  { key: 'menu', de: 'Speisekarte', en: 'Menu', pageHref: { de: '/menu', en: '/en/menu' } },
  { key: 'gallery', de: 'Galerie', en: 'Gallery', pageHref: { de: '/gallery', en: '/en/gallery' } },
  { key: 'events', de: 'Events', en: 'Events', pageHref: { de: '/events', en: '/en/events' } },
  { key: 'reviews', de: 'Bewertungen', en: 'Reviews', pageHref: { de: '/reviews', en: '/en/reviews' } },
  { key: 'contact', de: 'Kontakt', en: 'Contact', pageHref: { de: '/contact', en: '/en/contact' } },
]

export const FOOTER_NAV_ITEMS: SiteNavItem[] = [
  { key: 'about', de: 'Über uns', en: 'About', pageHref: { de: '/about', en: '/en/about' } },
  { key: 'experience', de: 'Erlebnisse', en: 'Experiences', pageHref: { de: '/experience', en: '/en/experience' } },
  { key: 'menu', de: 'Speisekarte', en: 'Menu', pageHref: { de: '/menu', en: '/en/menu' } },
  { key: 'gallery', de: 'Galerie', en: 'Gallery', pageHref: { de: '/gallery', en: '/en/gallery' } },
  { key: 'events', de: 'Events', en: 'Events', pageHref: { de: '/events', en: '/en/events' } },
]

export function resolveSiteHref(pathname: string, item: SiteNavItem): string {
  const locale = getPathLocale(pathname)

  if (item.pageHref) {
    return item.pageHref[locale] ?? item.pageHref.de
  }

  if (!item.homeAnchor) {
    return buildLocalizedPath(locale, '/')
  }

  return getHomeSectionHref(pathname, item.homeAnchor)
}

export function getLogoHref(pathname: string): string {
  const locale = getPathLocale(pathname)
  const basePath = stripLocalePrefix(pathname)

  return basePath === '/' ? '#hero' : buildLocalizedPath(locale, '/')
}

export function getReservationHref(pathname: string): string {
  return getHomeSectionHref(pathname, '#reservation')
}

export function getMenuHref(pathname: string): string {
  const locale = getPathLocale(pathname)
  return buildLocalizedPath(locale, '/menu')
}

export function getGalleryHref(pathname: string): string {
  const locale = getPathLocale(pathname)
  return buildLocalizedPath(locale, '/gallery')
}
