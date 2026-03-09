'use client'

import { useLang } from '@/context/LangContext'

export default function Footer() {
  const { t } = useLang()
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { href: '#about', de: 'Über uns', en: 'About' },
    { href: '#experience', de: 'Erlebnisse', en: 'Experiences' },
    { href: '#menu', de: 'Speisekarte', en: 'Menu' },
    { href: '#gallery', de: 'Galerie', en: 'Gallery' },
    { href: '#events', de: 'Events', en: 'Events' },
  ]

  const socials = [
    { label: 'Facebook', short: 'f' },
    { label: 'Instagram', short: 'IG' },
    { label: 'WhatsApp', short: 'WA' },
    { label: 'TripAdvisor', short: 'TA' },
  ]

  return (
    <footer className="footer-section">
      <div className="footer-shell">
        <div className="footer-top">
          <div className="footer-brand-card">
            <div className="footer-brand-title">Neue Liebe</div>
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
            <h5 className="footer-heading">{t('Navigation', 'Navigation')}</h5>
            <ul className="footer-nav-list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="footer-nav-link">
                    {t(link.de, link.en)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h5 className="footer-heading">{t('Kontakt', 'Contact')}</h5>
            <div className="footer-contact-copy">
              <p>Wetzendorfer Str. 10</p>
              <p>06642 Nebra (Unstrut)</p>
              <a href="tel:034461599804" className="footer-accent-link">
                034461 599804
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5 className="footer-heading">{t('Öffnungszeiten', 'Hours')}</h5>
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
