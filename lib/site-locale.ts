export type SiteLocale = 'de' | 'en'
export type SitePath = `/${string}` | '/'
export type SiteAnchor = `#${string}`

export const DEFAULT_SITE_LOCALE: SiteLocale = 'de'
export const LOCALIZED_SITE_PATHS = new Set<SitePath>(['/', '/about', '/experience', '/menu', '/gallery', '/events', '/news', '/reviews', '/contact'])

export function getPathLocale(pathname: string | null | undefined): SiteLocale {
  if (!pathname) {
    return DEFAULT_SITE_LOCALE
  }

  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'de'
}

export function stripLocalePrefix(pathname: string | null | undefined): SitePath {
  if (!pathname || pathname === '/') {
    return '/'
  }

  if (pathname === '/en') {
    return '/'
  }

  if (pathname.startsWith('/en/')) {
    return pathname.slice(3) as SitePath
  }

  return pathname as SitePath
}

export function buildLocalizedPath(locale: SiteLocale, path: SitePath): SitePath {
  if (locale === 'de') {
    return path
  }

  return path === '/' ? '/en' : `/en${path}` as SitePath
}

export function getHomePath(locale: SiteLocale): SitePath {
  return buildLocalizedPath(locale, '/')
}

export function getHomeSectionHref(pathname: string, anchor: SiteAnchor): string {
  const locale = getPathLocale(pathname)
  const basePath = stripLocalePrefix(pathname)

  if (basePath === '/') {
    return anchor
  }

  return `${getHomePath(locale)}${anchor}`
}

export function switchLocalePath(pathname: string, targetLocale: SiteLocale): SitePath {
  const basePath = stripLocalePrefix(pathname)
  const hasLocalizedPath =
    LOCALIZED_SITE_PATHS.has(basePath)
    || basePath.startsWith('/news/')

  if (targetLocale === 'en' && !hasLocalizedPath) {
    return buildLocalizedPath(targetLocale, '/')
  }

  return buildLocalizedPath(targetLocale, basePath)
}
