'use client'

import { type Lang, useLang } from '@/context/LangContext'
import SitePageShell from '@/components/SitePageShell'

function ImpressumContent() {
  const { t } = useLang()

  return (
    <main style={{ background: 'var(--cream)', paddingTop: '80px', minHeight: '100vh' }}>
      <section
        style={{
          background:
            'radial-gradient(circle at 12% 10%, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0) 42%), linear-gradient(180deg, #faf6f0 0%, #f5ede0 100%)',
          padding: 'clamp(5rem, 8vw, 7rem) 4vw clamp(2.5rem, 5vw, 4rem)',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 className="section-title" style={{ color: 'var(--charcoal)', marginBottom: '2rem' }}>
            {t('Impressum', 'Imprint')}
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--charcoal-alpha)', lineHeight: '1.6' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--charcoal)' }}>
                {t('Angaben gemäß § 5 TMG', 'Information pursuant to § 5 TMG')}
              </h2>
              <p>Sebastian Sieber</p>
              <p>Wetzendorfer Str. 10</p>
              <p>06642 Nebra (Unstrut)</p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--charcoal)' }}>
                {t('Kontakt', 'Contact')}
              </h2>
              <p>{t('Telefon', 'Phone')}: 034461 599804</p>
              <p>E-Mail: info@waldschloesschen-wangen.de</p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--charcoal)' }}>
                {t('Redaktionell verantwortlich', 'Editorial responsibility')}
              </h2>
              <p>Sebastian Sieber</p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--charcoal)' }}>
                {t('EU-Streitschlichtung', 'EU Dispute Resolution')}
              </h2>
              <p>
                {t(
                  'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: ',
                  'The European Commission provides a platform for online dispute resolution (OS): '
                )}
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                  https://ec.europa.eu/consumers/odr/
                </a>.
                <br />
                {t(
                  'Unsere E-Mail-Adresse finden Sie oben im Impressum.',
                  'You can find our email address in the imprint above.'
                )}
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--charcoal)' }}>
                {t('Hosting', 'Hosting')}
              </h2>
              <p>{t('Diese Website wird gehostet bei:', 'This website is hosted by:')} hostinger.com</p>
              <p>{t('Datenbank-Services:', 'Database services:')} Neon</p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--charcoal)' }}>
                  {t(
                    'Technische Umsetzung und Webentwicklung:',
                    'Technical implementation and web development:'
                  )}
              </h2>
              <p>
                <a
                  href="https://saaleweb.de/"
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  style={{ color: 'var(--gold-dark)', textDecoration: 'underline', textUnderlineOffset: 3 }}
                >
                  SaaleWeb
                </a>
              </p>
            </div>
            
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--charcoal)' }}>
                {t('Verbraucher­streit­beilegung/Universal­schlichtungs­stelle', 'Consumer dispute resolution/universal arbitration board')}
              </h2>
              <p>
                {t(
                  'Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.',
                  'We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.'
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function ImpressumClient({ initialLang = 'de' }: { initialLang?: Lang }) {
  return (
    <SitePageShell initialLang={initialLang}>
      <ImpressumContent />
    </SitePageShell>
  )
}
