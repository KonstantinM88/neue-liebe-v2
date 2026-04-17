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
      title: t(
        'Zentrale Lage & Gute Erreichbarkeit in Nebra',
        'Central Location & Easy Accessibility in Nebra'
      ),
      text: t(
        'Unser Restaurant Neue Liebe befindet sich in optimaler Lage in Nebra (Unstrut) und ist einfach zu erreichen. Es stehen ausreichend Parkmöglichkeiten in der Nähe zur Verfügung, damit Ihr Besuch entspannt beginnen kann.',
        'Our restaurant Neue Liebe is in an optimal location in Nebra (Unstrut) and is easy to reach. Sufficient parking is available nearby so that your visit can begin in a relaxed manner.'
      ),
    },
    {
      title: t(
        'Jetzt Tisch reservieren oder Event anfragen',
        'Book a Table or Request an Event Now'
      ),
      text: t(
        'Wir freuen uns auf Ihren Besuch! Nutzen Sie unser praktisches Kontaktformular oder rufen Sie uns direkt an, um Ihren Lieblingstisch zu reservieren oder die Details für Ihr nächstes großes Event unverbindlich zu besprechen.',
        'We look forward to your visit! Use our practical contact form or call us directly to reserve your favorite table or to discuss the details for your next big event without obligation.'
      ),
    },
    {
      title: t(
        'Öffnungszeiten für Mittag- und Abendessen',
        'Opening Hours for Lunch and Dinner'
      ),
      text: t(
        'Ob spontanes Mittagessen während eines Ausflugs an die Unstrut oder ausgiebiges Dinner am Abend – wir haben zu attraktiven Zeiten für Sie geöffnet. Alle aktuellen Öffnungszeiten finden Sie übersichtlich auf dieser Seite.',
        'Whether a spontaneous lunch during an excursion to the Unstrut or an extensive dinner in the evening – we are open for you at attractive times. All current opening hours can be clearly found on this page.'
      ),
    },
  ]
  const faq = getPageFaqContent('contact', lang)

  return (
    <main className="contact-section contact-page-main">
      <section className="contact-page-hero">
        <div className="contact-page-hero-inner">
          <p className="section-label contact-page-eyebrow">
            {t('Kontakt & Anfahrt', 'Contact & Directions')}
          </p>
          <h1 className="section-title contact-page-title">
            {t('Finden Sie Ihren Weg zur Neuen Liebe', 'Find Your Way to Neue Liebe')}
          </h1>
          <p className="contact-page-lead">
            {t(
              'Hier finden Sie Adresse, Telefonnummer, Öffnungszeiten und den direkten Weg zur Neuen Liebe in Nebra (Unstrut).',
              'Here you will find our address, phone number, opening hours and the direct way to Neue Liebe in Nebra (Unstrut).'
            )}
          </p>

          <div className="contact-page-actions">
            <Link
              href={getReservationHref(pathname)}
              className="nav-cta"
              style={{ minWidth: 220 }}
            >
              {t('Tisch reservieren', 'Reserve a Table')}
            </Link>
            <a
              href="tel:034461599804"
              className="contact-page-secondary-cta"
            >
              {t('Jetzt anrufen', 'Call Now')}
            </a>
          </div>
        </div>
      </section>

      <Contact sectionId={undefined} disableReveal />
      <SeoTextSection
        eyebrow={t('Ihr Weg zu uns', 'Your Way to Us')}
        title={t(
          'So erreichen Sie Ihr Lieblingsrestaurant in Nebra',
          'How to Reach Your Favorite Restaurant in Nebra'
        )}
        lead={t(
          'Haben Sie Fragen zu unserer Speisekarte, möchten Sie eine Feier planen oder direkt einen Tisch reservieren? Hier finden Sie alle Kontaktdaten, Öffnungszeiten und den schnellsten Weg zur Neuen Liebe in Nebra (Unstrut).',
          'Do you have questions about our menu, would you like to plan a celebration, or reserve a table right away? Here you will find all contact details, opening hours, and the fastest way to Neue Liebe in Nebra (Unstrut).'
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
