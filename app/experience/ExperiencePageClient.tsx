'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import FaqSection from '@/components/FaqSection'
import SeoTextSection from '@/components/SeoTextSection'
import SitePageShell from '@/components/SitePageShell'
import Experience from '@/components/sections/Experience'
import { type Lang, useLang } from '@/context/LangContext'
import { getPageFaqContent } from '@/lib/page-faqs'
import { getMenuHref, getReservationHref } from '@/lib/site-nav'

function ExperiencePageContent() {
  const { lang, t } = useLang()
  const pathname = usePathname()
  const seoItems = [
    {
      title: t('Sommerterrasse für entspannte Abende', 'Summer Terrace for Relaxed Evenings'),
      text: t(
        'Unsere Terrasse in Nebra (Unstrut) ist für Gäste gedacht, die einen Abend nicht nur kulinarisch, sondern auch atmosphärisch genießen möchten. Gerade in den warmen Monaten entsteht hier ein ruhiger Gegenpol zum Alltag.',
        'Our terrace in Nebra (Unstrut) is designed for guests who want to enjoy an evening not only through cuisine, but also through atmosphere. During the warmer months it becomes a calm counterpoint to everyday life.'
      ),
    },
    {
      title: t('Bankettsaal für private und geschäftliche Feiern', 'Banquet Hall for Private and Business Events'),
      text: t(
        'Wer eine Eventlocation in Nebra sucht, findet mit unserem Bankettsaal einen Rahmen für Hochzeiten, Familienfeste und Firmenveranstaltungen. Der Fokus liegt auf stilvollem Ambiente und flexibler Nutzung.',
        'Anyone looking for an event location in Nebra will find a fitting setting in our banquet hall for weddings, family celebrations and corporate events. The focus is on a stylish ambiance and flexible use.'
      ),
    },
    {
      title: t('Tanz- und Musikabende mit eigenem Profil', 'Dance and Music Evenings with Their Own Character'),
      text: t(
        'Die Erlebniswelt der Neuen Liebe endet nicht beim Essen. Themenabende, Musik und Tanz sorgen dafür, dass Gäste das Restaurant auch als lebendigen Treffpunkt für besondere Abende wahrnehmen.',
        'The Neue Liebe experience does not end with dinner. Themed evenings, music and dancing make the restaurant feel like a lively meeting place for memorable nights.'
      ),
    },
  ]
  const faq = getPageFaqContent('experience', lang)

  return (
    <main style={{ background: 'var(--charcoal)', paddingTop: '80px' }}>
      <section
        style={{
          background:
            'radial-gradient(circle at 12% 10%, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0) 42%), linear-gradient(180deg, #201b16 0%, #15110d 100%)',
          padding: 'clamp(5rem, 8vw, 7rem) 4vw clamp(2.8rem, 5vw, 4rem)',
        }}
      >
        <div style={{ maxWidth: 980, margin: '0 auto', textAlign: 'center' }}>
          <p className="section-label" style={{ color: 'var(--gold)' }}>
            {t('Erlebnisse in Neue Liebe', 'Experiences at Neue Liebe')}
          </p>
          <h1
            className="section-title"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.4rem)', color: '#fff' }}
          >
            {t('Atmosphäre, Genuss und besondere Momente', 'Atmosphere, indulgence and memorable moments')}
          </h1>
          <p
            style={{
              maxWidth: 760,
              margin: '1.4rem auto 0',
              fontSize: 'clamp(1rem, 1.8vw, 1.08rem)',
              lineHeight: 1.85,
              color: 'rgba(255,255,255,0.72)',
              fontWeight: 300,
            }}
          >
            {t(
              'Entdecken Sie unsere Sommerterrasse, den eleganten Bankettsaal und stimmungsvolle Tanz- und Eventabende. Jede Erlebniswelt der Neuen Liebe verbindet Gastlichkeit, Stil und besondere Augenblicke.',
              'Discover our summer terrace, the elegant banquet hall and vibrant dance and event evenings. Every experience at Neue Liebe combines hospitality, style and memorable moments.'
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
              {t('Jetzt reservieren', 'Reserve Now')}
            </Link>
            <Link
              href={getMenuHref(pathname)}
              style={{
                minWidth: 220,
                padding: '11px 24px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.16)',
                color: '#fff',
                textDecoration: 'none',
                fontFamily: "'Jost', sans-serif",
                fontSize: '0.7rem',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {t('Zur Speisekarte', 'View Menu')}
            </Link>
          </div>
        </div>
      </section>

      <Experience />
      <SeoTextSection
        eyebrow={t('Erlebniswelten', 'Experience Worlds')}
        title={t(
          'Terrasse, Saal und Eventabende auf einer Seite',
          'Terrace, Hall and Event Evenings in One Place'
        )}
        lead={t(
          'Die Seite „Erlebnisse“ bündelt genau die Themen, nach denen Gäste häufig suchen: Restaurant mit Terrasse, Bankettsaal für Feiern und besondere Eventabende in Nebra (Unstrut). Damit wird klar, dass Neue Liebe mehr ist als ein klassischer Restaurantbesuch.',
          'The Experiences page brings together exactly the topics guests often search for: a restaurant with terrace, a banquet hall for celebrations and special event evenings in Nebra (Unstrut). It makes clear that Neue Liebe offers more than a classic restaurant visit.'
        )}
        items={seoItems}
        theme="dark"
      />
      <FaqSection
        eyebrow={faq.eyebrow}
        title={faq.title}
        lead={faq.lead}
        items={faq.items}
        theme="dark"
      />
    </main>
  )
}

type ExperiencePageClientProps = {
  initialLang?: Lang
}

export default function ExperiencePageClient({
  initialLang = 'de',
}: ExperiencePageClientProps) {
  return (
    <SitePageShell initialLang={initialLang}>
      <ExperiencePageContent />
    </SitePageShell>
  )
}
