'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FaqSection from '@/components/FaqSection'
import SeoTextSection from '@/components/SeoTextSection'
import SitePageShell from '@/components/SitePageShell'
import Contact from '@/components/sections/Contact'
import { type Lang, useLang } from '@/context/LangContext'
import { getPageFaqContent } from '@/lib/page-faqs'
import { getReservationHref } from '@/lib/site-nav'

function ContactPageContent() {
  const { lang, t } = useLang()
  const pathname = usePathname()
  const seoItems = [
    {
      title: t('Restaurant in zentraler Lage von Nebra', 'A Restaurant in a Convenient Nebra Location'),
      text: t(
        'Die Kontaktseite bündelt bewusst alle wichtigen Angaben für Gäste, die nach Adresse oder Anfahrt zur Neuen Liebe suchen. Damit wird die Seite zu einem klaren Einstiegspunkt für lokale Suchanfragen rund um Restaurant und Besuch in Nebra.',
        'The contact page intentionally brings together all relevant details for guests looking for the address or directions to Neue Liebe. This makes it a clear entry point for local searches related to restaurants and visits in Nebra.'
      ),
    },
    {
      title: t('Telefonische Anfrage und Reservierung', 'Phone Enquiries and Reservations'),
      text: t(
        'Neben der Anschrift ist für viele Besucher vor allem die schnelle Kontaktaufnahme wichtig. Durch Telefonnummer, Öffnungszeiten und direkte Anfahrtsinformationen lässt sich ein Besuch ohne Umwege planen.',
        'Alongside the address, quick contact is essential for many visitors. With the phone number, opening hours and direct directions available, a visit can be planned without extra steps.'
      ),
    },
    {
      title: t('Praktisch für Abendessen, Feier und spontanen Besuch', 'Useful for Dinner, Celebrations and Spontaneous Visits'),
      text: t(
        'Die Seite funktioniert nicht nur als Pflichtkontakt, sondern auch als praktische Planungsseite für Abendessen, Feier oder kurzen Zwischenstopp. Genau das macht sie für lokale SEO und echte Nutzer besonders wertvoll.',
        'The page is more than a mandatory contact section. It also works as a practical planning page for dinner, celebrations or a spontaneous visit. That is what makes it valuable for both local SEO and real users.'
      ),
    },
  ]
  const faq = getPageFaqContent('contact', lang)

  return (
    <main className="contact-section" style={{ paddingTop: '80px' }}>
      <section
        style={{
          background:
            'radial-gradient(circle at 12% 10%, rgba(201,169,110,0.16) 0%, rgba(201,169,110,0) 42%), linear-gradient(180deg, #faf6f0 0%, #f2e5d4 100%)',
          padding: 'clamp(5rem, 8vw, 7rem) 4vw clamp(2.8rem, 5vw, 4rem)',
        }}
      >
        <div style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--gold)' }}>
            {t('Kontakt & Anfahrt', 'Contact & Directions')}
          </p>
          <h1
            className="section-title"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.4rem)', color: 'var(--charcoal)' }}
          >
            {t('Finden Sie Ihren Weg zur Neuen Liebe', 'Find Your Way to Neue Liebe')}
          </h1>
          <p
            style={{
              maxWidth: 760,
              margin: '1.4rem auto 0',
              fontSize: 'clamp(1rem, 1.8vw, 1.08rem)',
              lineHeight: 1.85,
              color: 'var(--brown-light)',
              fontWeight: 300,
            }}
          >
            {t(
              'Hier finden Sie Adresse, Telefonnummer, Öffnungszeiten und den direkten Weg zur Neuen Liebe in Nebra (Unstrut).',
              'Here you will find our address, phone number, opening hours and the direct way to Neue Liebe in Nebra (Unstrut).'
            )}
          </p>

          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '0.9rem',
              flexWrap: 'wrap',
            }}
          >
            <Link
              href={getReservationHref(pathname)}
              className="nav-cta"
              style={{ minWidth: 220 }}
            >
              {t('Tisch reservieren', 'Reserve a Table')}
            </Link>
            <a
              href="tel:034461599804"
              style={{
                minWidth: 220,
                padding: '11px 24px',
                borderRadius: 999,
                border: '1px solid rgba(74,55,40,0.16)',
                color: 'var(--charcoal)',
                textDecoration: 'none',
                fontFamily: "'Jost', sans-serif",
                fontSize: '0.7rem',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.5) 100%)',
                boxShadow: '0 12px 30px rgba(26,23,20,0.08)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {t('Jetzt anrufen', 'Call Now')}
            </a>
          </div>
        </div>
      </section>

      <Contact />
      <SeoTextSection
        eyebrow={t('Besuch planen', 'Plan Your Visit')}
        title={t(
          'Adresse, Öffnungszeiten und direkter Kontakt zur Neuen Liebe',
          'Address, Opening Hours and Direct Contact with Neue Liebe'
        )}
        lead={t(
          'Kontaktseiten werden oft unterschätzt, sind aber für lokale Sichtbarkeit besonders wichtig. Mit klaren Texten zu Lage, Erreichbarkeit und Reservierung stärkt diese Seite die Relevanz der Neuen Liebe für Suchanfragen in Nebra (Unstrut) und Umgebung.',
          'Contact pages are often underestimated, but they are especially important for local visibility. With clear copy about location, accessibility and reservations, this page strengthens the relevance of Neue Liebe for searches in and around Nebra (Unstrut).'
        )}
        items={seoItems}
      />
      <FaqSection
        eyebrow={faq.eyebrow}
        title={faq.title}
        lead={faq.lead}
        items={faq.items}
      />
    </main>
  )
}

type ContactPageClientProps = {
  initialLang?: Lang
}

export default function ContactPageClient({
  initialLang = 'de',
}: ContactPageClientProps) {
  return (
    <SitePageShell initialLang={initialLang}>
      <ContactPageContent />
    </SitePageShell>
  )
}
