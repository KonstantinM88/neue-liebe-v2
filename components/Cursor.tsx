'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const cursorRef  = useRef<HTMLDivElement>(null)
  const ringRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const ring   = ringRef.current
    if (!cursor || !ring) return

    let cx = 0, cy = 0, rx = 0, ry = 0

    const onMove = (e: MouseEvent) => {
      cx = e.clientX
      cy = e.clientY
      cursor.style.left = cx + 'px'
      cursor.style.top  = cy + 'px'
    }

    let rafId: number
    const loop = () => {
      rx += (cx - rx) * 0.1
      ry += (cy - ry) * 0.1
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      rafId = requestAnimationFrame(loop)
    }

    const addHover = (el: Element) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover')
        ring.classList.add('hover')
      })
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover')
        ring.classList.remove('hover')
      })
    }

    document.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(loop)

    const interactives = document.querySelectorAll(
      'a, button, .menu-card, .gallery-item, .exp-card, .event-card'
    )
    interactives.forEach(addHover)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor" id="cursor" />
      <div ref={ringRef}   className="cursor-ring" id="cursorRing" />
    </>
  )
}
