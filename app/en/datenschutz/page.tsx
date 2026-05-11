import type { Metadata } from 'next'
import DatenschutzClient from '../../datenschutz/DatenschutzClient'

export const metadata: Metadata = {
  title: 'Privacy Policy | Neue Liebe',
  description: 'Privacy Policy of the restaurant Neue Liebe in Nebra (Unstrut).',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/en/datenschutz',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/datenschutz',
      'en-US': 'https://www.neueliebe-nebra.de/en/datenschutz',
      'x-default': 'https://www.neueliebe-nebra.de/datenschutz',
    },
  },
  robots: 'noindex, follow',
}

export default function DatenschutzPageEn() {
  return <DatenschutzClient initialLang="en" />
}
