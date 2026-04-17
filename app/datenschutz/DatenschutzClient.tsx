'use client'

import { type Lang, useLang } from '@/context/LangContext'
import SitePageShell from '@/components/SitePageShell'

function DatenschutzContent() {
  const { t } = useLang()

  const H2 = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{ fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--charcoal)', fontWeight: 500 }}>
      {children}
    </h2>
  )

  const H3 = ({ children }: { children: React.ReactNode }) => (
    <h3 style={{ fontSize: '1.15rem', marginTop: '1.8rem', marginBottom: '0.6rem', color: 'var(--charcoal)', fontWeight: 500 }}>
      {children}
    </h3>
  )

  const P = ({ children }: { children: React.ReactNode }) => (
    <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
      {children}
    </p>
  )

  return (
    <main style={{ background: 'var(--cream)', paddingTop: '80px', minHeight: '100vh' }}>
      <section
        style={{
          background: 'radial-gradient(circle at 12% 10%, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0) 42%), linear-gradient(180deg, #faf6f0 0%, #f5ede0 100%)',
          padding: 'clamp(5rem, 8vw, 7rem) 4vw clamp(2.5rem, 5vw, 4rem)',
        }}
      >
        <div style={{ maxWidth: 840, margin: '0 auto', color: 'var(--charcoal-alpha)' }}>
          <h1 className="section-title" style={{ color: 'var(--charcoal)', marginBottom: '1rem' }}>
            {t('Datenschutzerklärung', 'Privacy Policy')}
          </h1>

          <div style={{ marginTop: '3rem' }}>
            
            <H2>1. {t('Datenschutz auf einen Blick', 'Data Protection at a Glance')}</H2>
            <H3>{t('Allgemeine Hinweise', 'General Information')}</H3>
            <P>
              {t(
                'Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.',
                'The following notes give a simple overview of what happens to your personal data when you visit this website. Personal data is any data with which you could be personally identified. Detailed information on the subject of data protection can be found in our privacy policy found below.'
              )}
            </P>

            <H3>{t('Datenerfassung auf dieser Website', 'Data Collection on this Website')}</H3>
            <P>
              <strong>{t('Wer ist verantwortlich für die Datenerfassung auf dieser Website?', 'Who is responsible for the data collection on this website?')}</strong><br />
              {t(
                'Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle“ in dieser Datenschutzerklärung entnehmen.',
                'The data processing on this website is carried out by the website operator. You can find their contact details in the section "Information about the responsible party" in this privacy policy.'
              )}
            </P>
            <P>
              <strong>{t('Wie erfassen wir Ihre Daten?', 'How do we collect your data?')}</strong><br />
              {t(
                'Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben. Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.',
                'Some data are collected when you provide it to us. This could, for example, be data you enter into a contact form. Other data are collected automatically by our IT systems when you visit the website. These data are primarily technical data such as the browser and operating system you are using or when you accessed the page. These data are collected automatically as soon as you enter this website.'
              )}
            </P>
            <P>
              <strong>{t('Wofür nutzen wir Ihre Daten?', 'What do we use your data for?')}</strong><br />
              {t(
                'Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.',
                'Part of the data is collected to ensure the error-free provision of the website. Other data can be used to analyze your user patterns.'
              )}
            </P>
            <P>
              <strong>{t('Welche Rechte haben Sie bezüglich Ihrer Daten?', 'What rights do you have regarding your data?')}</strong><br />
              {t(
                'Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.',
                'You always have the right to request information about your stored data, its origin, its recipients, and the purpose of its collection at no charge. You also have the right to request that it be corrected or deleted. If you have given your consent to data processing, you can revoke this consent at any time for the future. You also have the right to request the restriction of the processing of your personal data under certain circumstances. Finally, you have the right to file a complaint with the competent supervisory authority.'
              )}
            </P>

            <H2>2. {t('Hosting', 'Hosting')}</H2>
            <P>
              {t(
                'Wir hosten die Inhalte unserer Website bei folgendem Anbieter:',
                'We host the content of our website with the following provider:'
              )}
            </P>
            <P><strong>Hostinger & Neon</strong></P>
            <P>
              {t(
                'Der Anbieter für unser Website-Hosting ist hostinger.com. Zudem wird für die Datenbank-Infrastruktur Neon verwendet. Alle anfallenden Daten werden auf den Servern dieser Anbieter verarbeitet. Die Speicherung und Verarbeitung der Daten erfolgt in Übereinstimmung mit den geltenden Datenschutzrichtlinien (DSGVO).',
                'The provider for our website hosting is hostinger.com. In addition, Neon is used for the database infrastructure. All generated data is processed on the servers of these providers. The storage and processing of data takes place in accordance with the applicable data protection guidelines (GDPR).'
              )}
            </P>
            <P>
              {t(
                'Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag, der gewährleistet, dass dieser die personenbezogenen Daten unserer Websitebesucher nur nach unseren Weisungen und unter Einhaltung der DSGVO verarbeitet.',
                'We have concluded a contract for order processing (AVV) for the use of the above-mentioned service. This is a contract mandated by data privacy laws that guarantees that they process personal data of our website visitors only based on our instructions and in compliance with the GDPR.'
              )}
            </P>

            <H2>3. {t('Allgemeine Hinweise und Pflichtinformationen', 'General Information and Mandatory Information')}</H2>
            <H3>{t('Datenschutz', 'Data Protection')}</H3>
            <P>
              {t(
                'Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.',
                'The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy.'
              )}
            </P>
            <P>
              {t(
                'Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.',
                'Please note that data transmitted via the internet (e.g., via email communication) may be subject to security breaches. Complete protection of your data from third-party access is not possible.'
              )}
            </P>

            <H3>{t('Hinweis zur verantwortlichen Stelle', 'Information about the responsible party')}</H3>
            <P>
              {t('Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:', 'The responsible party for data processing on this website is:')}
            </P>
            <P>
              Sebastian Sieber<br />
              Wetzendorfer Str. 10<br />
              06642 Nebra (Unstrut)<br />
              {t('Telefon', 'Phone')}: 03 44 61 - 59 98 04<br />
              E-Mail: info@waldschloesschen-wangen.de
            </P>
            <P>
              {t(
                'Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.',
                'The responsible party is the natural or legal person who alone or jointly with others decides on the purposes and means of processing personal data.'
              )}
            </P>

            <H3>{t('Speicherdauer', 'Storage duration')}</H3>
            <P>
              {t(
                'Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung haben.',
                'Unless a more specific storage period has been specified in this privacy policy, your personal data will remain with us until the purpose for which it was collected no longer applies. If you assert a justified request for deletion or revoke your consent to data processing, your data will be deleted, unless we have other legally permissible reasons for storing your personal data.'
              )}
            </P>

            <H3>{t('Hinweis zur Datenweitergabe in die USA und sonstige Drittstaaten', 'Information on data transfer to the USA and other non-EU countries')}</H3>
            <P>
              {t(
                'Wir verwenden unter anderem Tools von Unternehmen mit Sitz in den USA oder sonstigen datenschutzrechtlich nicht sicheren Drittstaaten. Wenn diese Tools aktiv sind, können Ihre personenbezogene Daten in diese Drittstaaten übertragen und dort verarbeitet werden.',
                'Among other things, we use tools of companies domiciled in the United States or other from a data protection perspective non-secure non-EU countries. If these tools are active, your personal data may potentially be transferred to these non-EU countries and may be processed there.'
              )}
            </P>

            <H3>{t('SSL- bzw. TLS-Verschlüsselung', 'SSL and/or TLS encryption')}</H3>
            <P>
              {t(
                'Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.',
                'For security reasons and to protect the transmission of confidential content, this website uses either an SSL or a TLS encryption program. You can recognize an encrypted connection by checking whether the address line of the browser switches from "http://" to "https://" and also by the appearance of the lock icon in the browser line.'
              )}
            </P>

            <H2>4. {t('Datenerfassung auf dieser Website', 'Data Collection on this Website')}</H2>
            <H3>{t('Cookies', 'Cookies')}</H3>
            <P>
              {t(
                'Unsere Internetseiten verwenden so genannte „Cookies“. Cookies sind kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung oder dauerhaft auf Ihrem Endgerät gespeichert.',
                'Our websites and pages use what the industry refers to as "cookies." Cookies are small data packages that do not cause any damage to your device. They are stored either temporarily for the duration of a session (session cookies) or permanently on your device (permanent cookies).'
              )}
            </P>
            <P>
              {t(
                'Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs, zur Bereitstellung bestimmter Funktionen oder zur Optimierung der Website erforderlich sind, werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert.',
                'Cookies that are required to carry out the electronic communication process, to provide certain functions or to optimize the website are stored on the basis of Art. 6(1)(f) GDPR.'
              )}
            </P>

            <H3>{t('Server-Log-Dateien', 'Server log files')}</H3>
            <P>
              {t(
                'Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind:',
                'The provider of this website and its pages automatically collects and stores information in so-called server log files, which your browser communicates to us automatically. The information comprises:'
              )}
            </P>
            <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: '1.6' }}>
              <li>{t('Browsertyp und Browserversion', 'The type and version of browser used')}</li>
              <li>{t('verwendetes Betriebssystem', 'The used operating system')}</li>
              <li>{t('Referrer URL', 'Referrer URL')}</li>
              <li>{t('Hostname des zugreifenden Rechners', 'The hostname of the accessing computer')}</li>
              <li>{t('Uhrzeit der Serveranfrage', 'The time of the server inquiry')}</li>
              <li>{t('IP-Adresse', 'The IP address')}</li>
            </ul>
            <P>
              {t(
                'Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.',
                'This data is not merged with other data sources. This data is recorded on the basis of Art. 6(1)(f) GDPR.'
              )}
            </P>

            <H3>{t('Kontaktformular & E-Mail-Anfragen', 'Contact form & email inquiries')}</H3>
            <P>
              {t(
                'Wenn Sie uns per Kontaktformular oder per E-Mail Anfragen zukommen lassen, werden Ihre Angaben inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.',
                'If you submit inquiries to us via our contact form or email, the information provided in the inquiry as well as any contact information provided therein will be stored by us in order to handle your inquiry and in the event that we have further questions. We will not share this information without your consent.'
              )}
            </P>

            <H2>5. {t('Plugins und Tools', 'Plugins and Tools')}</H2>
            <H3>{t('Google Fonts (lokales Hosting)', 'Google Fonts (local hosting)')}</H3>
            <P>
              {t(
                'Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Google Fonts, die von Google bereitgestellt werden. Die Google Fonts sind lokal installiert. Eine Verbindung zu Servern von Google findet dabei nicht statt.',
                'This site uses so-called Google Fonts for the uniform display of fonts, which are provided by Google. The Google Fonts are installed locally. There is no connection to Google servers in this context.'
              )}
            </P>
            <H3>{t('Google Maps', 'Google Maps')}</H3>
            <P>
              {t(
                'Diese Seite nutzt den Kartendienst Google Maps. Anbieter ist die Google Ireland Limited („Google“), Gordon House, Barrow Street, Dublin 4, Irland. Zur Nutzung der Funktionen von Google Maps ist es notwendig, Ihre IP-Adresse zu speichern. Diese Informationen werden in der Regel an einen Server von Google in den USA übertragen und dort gespeichert.',
                'This site uses the mapping service Google Maps. The provider is Google Ireland Limited ("Google"), Gordon House, Barrow Street, Dublin 4, Ireland. To enable the features of Google Maps, your IP address must be stored. As a rule, this information is transferred to one of Google’s servers in the United States, where it is archived.'
              )}
            </P>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function DatenschutzClient({ initialLang = 'de' }: { initialLang?: Lang }) {
  return (
    <SitePageShell initialLang={initialLang}>
      <DatenschutzContent />
    </SitePageShell>
  )
}
