'use client'

import { useLang } from '@/context/LangContext'

type InfoItemKind = 'location' | 'phone' | 'hours' | 'price'

function InfoBarIcon({ kind }: { kind: InfoItemKind }) {
  const commonProps = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.6',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  switch (kind) {
    case 'location':
      return (
        <svg {...commonProps}>
          <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2.4" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...commonProps}>
          <path d="M7.8 4.9h2.4l1.1 3.3-1.8 1.6a14.6 14.6 0 0 0 4.7 4.7l1.6-1.8 3.3 1.1v2.4c0 .8-.7 1.5-1.5 1.5A14.8 14.8 0 0 1 6.3 6.4c0-.8.7-1.5 1.5-1.5Z" />
        </svg>
      )
    case 'hours':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="8.2" />
          <path d="M12 7.8v4.6l3 1.8" />
        </svg>
      )
    case 'price':
      return (
        <svg {...commonProps}>
          <path d="M5 8.5h14" />
          <path d="M5 15.5h14" />
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
          <path d="M12 9.2v5.6" />
          <path d="M9.8 11h4.4" />
        </svg>
      )
  }
}

export default function InfoBar() {
  const { t } = useLang()

  const items = [
    {
      kind: 'location' as const,
      text: 'Wetzendorfer Str. 10, 06642 Nebra (Unstrut)',
      href: 'https://www.google.com/maps/search/?api=1&query=Wetzendorfer+Str.+10,+06642+Nebra+(Unstrut)',
      target: '_blank',
      rel: 'noreferrer',
      label: t('Adresse in Google Maps öffnen', 'Open address in Google Maps'),
    },
    {
      kind: 'phone' as const,
      text: '034461 599804',
      href: 'tel:034461599804',
      label: t('Restaurant anrufen', 'Call the restaurant'),
    },
    {
      kind: 'hours' as const,
      text: t('Mi–Sa 15-23 · So 10-16', 'Wed–Sat 15-23 · Sun 10-16'),
      href: '#contact',
      label: t('Öffnungszeiten ansehen', 'View opening hours'),
    },
    {
      kind: 'price' as const,
      text: `20–30€ ${t('p.P.', 'p.P.')}`,
      href: '#menu',
      label: t('Speisekarte ansehen', 'View the menu'),
    },
  ]

  return (
    <div className="info-bar">
      <div className="info-bar-inner">
        {items.map((item) => (
          <a
            key={item.kind}
            className="info-bar-item"
            href={item.href}
            aria-label={item.label}
            target={item.target}
            rel={item.rel}
          >
            <span className="info-bar-icon-shell">
              <span className="info-bar-icon">
                <InfoBarIcon kind={item.kind} />
              </span>
            </span>
            <span className="info-bar-text">{item.text}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
