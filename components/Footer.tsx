'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/context/LangContext'
import { useInViewOnce } from '@/hooks/useInViewOnce'
import { FOOTER_NAV_ITEMS, resolveSiteHref } from '@/lib/site-nav'

export default function Footer() {
  const { t } = useLang()
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()
  const { ref: footerShellRef, isInView: isWaveActive } =
    useInViewOnce<HTMLDivElement>('0px 0px -12% 0px')

  const socials = [
    { label: 'Facebook', short: 'f' },
    { label: 'Instagram', short: 'IG' },
    { label: 'WhatsApp', short: 'WA' },
    { label: 'TripAdvisor', short: 'TA' },
  ]

  return (
    <footer className="footer-section">
      <div
        ref={footerShellRef}
        className={`footer-shell${isWaveActive ? ' footer-shell--wave-active' : ''}`}
      >
        <div className="footer-top">
          <div className="footer-brand-card">
            <h2 className="footer-brand-title">Neue Liebe</h2>
            <p className="footer-brand-copy">
              {t(
                'Restaurant · Terrasse · Tanz & Events in Nebra (Unstrut), Sachsen-Anhalt',
                'Restaurant · Terrace · Dance & Events in Nebra (Unstrut), Saxony-Anhalt'
              )}
            </p>

            <div className="footer-socials">
              {socials.map((social) => (
                <a key={social.label} href="#" className="social-btn" aria-label={social.label}>
                  {social.short}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">{t('Navigation', 'Navigation')}</h3>
            <ul className="footer-nav-list">
              {FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link href={resolveSiteHref(pathname, item)} className="footer-nav-link">
                    {t(item.de, item.en)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">{t('Kontakt', 'Contact')}</h3>
            <div className="footer-contact-copy">
              <p>Wetzendorfer Str. 10</p>
              <p>06642 Nebra (Unstrut)</p>
              <a href="tel:034461599804" className="footer-accent-link">
                034461 599804
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">{t('Öffnungszeiten', 'Hours')}</h3>
            <div className="footer-contact-copy">
              <p>{t('Täglich geöffnet', 'Open daily')}</p>
              <p>{t('bis 23:00 Uhr', 'until 23:00')}</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-meta">
            © {currentYear} Restaurant Neue Liebe · Nebra (Unstrut)
          </p>
          <p className="footer-meta">
            {t('Impressum · Datenschutz', 'Imprint · Privacy')}
          </p>
        </div>
      </div>
    </footer>
  )
}
