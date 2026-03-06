'use client'

import { useLang } from '@/context/LangContext'

export default function Footer() {
  const { t } = useLang()

  const navLinks = [
    { href: '#about',       de: 'Über uns',    en: 'About' },
    { href: '#experience',  de: 'Erlebnisse',  en: 'Experiences' },
    { href: '#menu',        de: 'Speisekarte', en: 'Menu' },
    { href: '#gallery',     de: 'Galerie',     en: 'Gallery' },
    { href: '#events',      de: 'Events',      en: 'Events' },
  ]

  const socials = [
    { label: 'Facebook',    short: 'f' },
    { label: 'Instagram',   short: 'IG' },
    { label: 'WhatsApp',    short: 'WA' },
    { label: 'TripAdvisor', short: 'TA' },
  ]

  return (
    <footer style={{ background: 'var(--charcoal)', padding: '5rem 4vw 2rem' }}>
      <div className="footer-top">
        {/* Brand */}
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 300, color: 'var(--gold)', letterSpacing: '0.1em' }}>
            Neue Liebe
          </div>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontWeight: 300, marginTop: '1rem', maxWidth: 280 }}>
            {t(
              'Restaurant · Terrasse · Tanz & Events in Nebra (Unstrut), Sachsen-Anhalt',
              'Restaurant · Terrace · Dance & Events in Nebra (Unstrut), Saxony-Anhalt'
            )}
          </p>
          <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
            {socials.map((s) => (
              <a key={s.label} href="#" className="social-btn" aria-label={s.label}>{s.short}</a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h5 style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 400, marginBottom: '1.5rem', fontFamily: "'Jost', sans-serif" }}>
            {t('Navigation', 'Navigation')}
          </h5>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontWeight: 300, transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
                  {t(l.de, l.en)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h5 style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 400, marginBottom: '1.5rem', fontFamily: "'Jost', sans-serif" }}>
            {t('Kontakt', 'Contact')}
          </h5>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', fontWeight: 300, lineHeight: 1.7 }}>
            Wetzendorfer Str. 10<br />
            06642 Nebra (Unstrut)<br /><br />
            <a href="tel:034461599804" style={{ color: 'var(--gold)', textDecoration: 'none' }}>034461 599804</a>
          </p>
        </div>

        {/* Hours */}
        <div>
          <h5 style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 400, marginBottom: '1.5rem', fontFamily: "'Jost', sans-serif" }}>
            {t('Öffnungszeiten', 'Hours')}
          </h5>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', fontWeight: 300, lineHeight: 1.7 }}>
            {t('Täglich geöffnet', 'Open daily')}<br />
            {t('bis 23:00 Uhr', 'until 23:00')}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '2rem', flexWrap: 'wrap', gap: '1rem',
      }}>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>
          © 2024 Restaurant Neue Liebe · Nebra (Unstrut)
        </p>
        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>
          {t('Impressum · Datenschutz', 'Imprint · Privacy')}
        </p>
      </div>
    </footer>
  )
}
