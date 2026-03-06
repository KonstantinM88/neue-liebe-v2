'use client'

import { useLang } from '@/context/LangContext'

export default function InfoBar() {
  const { t } = useLang()

  const items = [
    { icon: '📍', text: 'Wetzendorfer Str. 10, 06642 Nebra (Unstrut)' },
    { icon: '📞', text: '034461 599804' },
    { icon: '🕐', text: t('Täglich geöffnet · Schließt 23:00', 'Open Daily · Closes 23:00') },
    { icon: '💶', text: `20–30€ ${t('p.P.', 'p.P.')}` },
  ]

  return (
    <div style={{
      background: 'var(--gold)',
      padding: '1.2rem 4vw',
      display: 'flex',
      justifyContent: 'center',
      gap: '4rem',
      flexWrap: 'wrap',
    }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          fontFamily: "'Jost', sans-serif",
          fontSize: '0.72rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--charcoal)',
        }}>
          <span style={{ fontSize: '1rem', opacity: 0.8 }}>{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  )
}
