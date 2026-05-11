import type { Metadata } from 'next'
import ImpressumClient from '../../impressum/ImpressumClient'

export const metadata: Metadata = {
  title: 'Imprint | Neue Liebe',
  description: 'Imprint and legal information of the restaurant Neue Liebe in Nebra (Unstrut).',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/en/impressum',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/impressum',
      'en-US': 'https://www.neueliebe-nebra.de/en/impressum',
      'x-default': 'https://www.neueliebe-nebra.de/impressum',
    },
  },
  robots: 'noindex, follow',
}

export default function ImpressumPageEn() {
  return <ImpressumClient initialLang="en" />
}
