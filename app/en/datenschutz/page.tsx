import type { Metadata } from 'next'
import DatenschutzClient from '../../datenschutz/DatenschutzClient'

export const metadata: Metadata = {
  title: 'Privacy Policy | Neue Liebe',
  description: 'Privacy Policy of the restaurant Neue Liebe in Nebra (Unstrut).',
  robots: 'noindex, follow',
}

export default function DatenschutzPageEn() {
  return <DatenschutzClient initialLang="en" />
}
