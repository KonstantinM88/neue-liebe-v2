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
    <div className="info-bar">
      <div className="info-bar-inner">
        {items.map((item, i) => (
          <div key={i} className="info-bar-item">
            <span className="info-bar-icon">{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
