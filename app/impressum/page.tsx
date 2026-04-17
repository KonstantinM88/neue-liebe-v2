import type { Metadata } from 'next'
import ImpressumClient from './ImpressumClient'

export const metadata: Metadata = {
  title: 'Impressum | Neue Liebe',
  description: 'Impressum und rechtliche Angaben des Restaurants Neue Liebe in Nebra (Unstrut).',
  robots: 'noindex, follow',
}

export default function ImpressumPage() {
  return <ImpressumClient />
}
