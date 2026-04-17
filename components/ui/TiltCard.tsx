'use client'

import React, { useRef, useState, ElementType } from 'react'

interface TiltCardProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  as?: ElementType
  maxTilt?: number
  scale?: number
}

export default function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  style,
  as: Component = 'div',
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const [tiltStyle, setTiltStyle] = useState({})
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return
    // Only apply on fine pointer devices (desktop)
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return

    setIsHovering(true)
    const el = cardRef.current
    const rect = el.getBoundingClientRect()
    
    // Calculate cursor position relative to the center of the card
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate rotation (-1 to 1) multiplied by maxTilt degrees
    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt

    // Dynamic gradient light tracking the cursor
    const lightX = (x / rect.width) * 100
    const lightY = (y / rect.height) * 100

    setTiltStyle({
      transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
      '--light-x': `${lightX}%`,
      '--light-y': `${lightY}%`,
    } as React.CSSProperties)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setTiltStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      '--light-x': '50%',
      '--light-y': '-20%',
    } as React.CSSProperties)
    
    // Remove the style after transition so it doesn't conflict with reveal states
    setTimeout(() => {
      setTiltStyle({})
    }, 400)
  }

  return (
    <Component
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        ...tiltStyle,
        transition: isHovering ? 'transform 0.15s ease-out' : 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
        willChange: 'transform',
      }}
      {...props}
    >
      {children}
    </Component>
  )
}
