import type { Metadata } from 'next'
import DatenschutzClient from './DatenschutzClient'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | Neue Liebe',
  description: 'Datenschutzerklärung des Restaurants Neue Liebe in Nebra (Unstrut).',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/datenschutz',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/datenschutz',
      'en-US': 'https://www.neueliebe-nebra.de/en/datenschutz',
      'x-default': 'https://www.neueliebe-nebra.de/datenschutz',
    },
  },
  robots: 'noindex, follow',
}

export default function DatenschutzPage() {
  return <DatenschutzClient />
}
