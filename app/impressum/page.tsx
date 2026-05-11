import type { Metadata } from 'next'
import ImpressumClient from './ImpressumClient'

export const metadata: Metadata = {
  title: 'Impressum | Neue Liebe',
  description: 'Impressum und rechtliche Angaben des Restaurants Neue Liebe in Nebra (Unstrut).',
  alternates: {
    canonical: 'https://www.neueliebe-nebra.de/impressum',
    languages: {
      'de-DE': 'https://www.neueliebe-nebra.de/impressum',
      'en-US': 'https://www.neueliebe-nebra.de/en/impressum',
      'x-default': 'https://www.neueliebe-nebra.de/impressum',
    },
  },
  robots: 'noindex, follow',
}

export default function ImpressumPage() {
  return <ImpressumClient />
}
