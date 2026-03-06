'use client'

import { useEffect } from 'react'

interface Props {
  message: string
  onDone: () => void
}

export default function Toast({ message, onDone }: Props) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDone, 3500)
    return () => clearTimeout(timer)
  }, [message, onDone])

  return (
    <div
      id="toast"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        background: 'var(--gold)',
        color: 'var(--charcoal)',
        padding: '1rem 2rem',
        fontFamily: "'Jost', sans-serif",
        fontSize: '0.8rem',
        letterSpacing: '0.1em',
        transform: message ? 'translateY(0)' : 'translateY(100px)',
        opacity: message ? 1 : 0,
        transition: 'all 0.4s var(--transition)',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  )
}
