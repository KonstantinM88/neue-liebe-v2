'use client'

import { useEffect, useState } from 'react'

export default function Loader() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 2400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div id="loader" className={hidden ? 'hidden' : ''}>
      <div className="loader-brand">Neue Liebe</div>
      <div className="loader-line" />
    </div>
  )
}
