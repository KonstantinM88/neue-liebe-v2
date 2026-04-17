import type { Metadata } from 'next'
import ImpressumClient from '../../impressum/ImpressumClient'

export const metadata: Metadata = {
  title: 'Imprint | Neue Liebe',
  description: 'Imprint and legal information of the restaurant Neue Liebe in Nebra (Unstrut).',
  robots: 'noindex, follow',
}

export default function ImpressumPageEn() {
  return <ImpressumClient initialLang="en" />
}
