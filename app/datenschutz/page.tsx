import type { Metadata } from 'next'
import DatenschutzClient from './DatenschutzClient'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung | Neue Liebe',
  description: 'Datenschutzerklärung des Restaurants Neue Liebe in Nebra (Unstrut).',
  robots: 'noindex, follow',
}

export default function DatenschutzPage() {
  return <DatenschutzClient />
}
