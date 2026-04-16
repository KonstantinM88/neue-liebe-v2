'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLang } from '@/context/LangContext'

type AboutStat = {
  label: string
  target?: number
  suffix?: string
  decimals?: number
  finalText?: string
}

function formatStat(stat: AboutStat, progress: number) {
  if (stat.finalText) {
    return progress >= 1 ? stat.finalText : '0+'
  }

  const target = stat.target ?? 0
  const nextValue = stat.decimals ? target * progress : Math.round(target * progress)

  if (stat.decimals) {
    return `${nextValue.toFixed(stat.decimals)}${stat.suffix ?? ''}`
  }

  return `${nextValue}${stat.suffix ?? ''}`
}

export default function About() {
  const { t } = useLang()
  const statsRef = useRef<HTMLDivElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const hasAnimatedRef = useRef(false)

  const stats = useMemo<AboutStat[]>(
    () => [
      { target: 15, suffix: '+', label: t('Jahre Erfahrung', 'Years Experience') },
      { target: 200, suffix: '+', label: t('Plätze', 'Seats') },
      { target: 4.8, decimals: 1, label: t('Google Bewertung', 'Google Rating') },
      { finalText: '∞', label: t('Leidenschaft', 'Passion') },
    ],
    [t]
  )

  const [displayStats, setDisplayStats] = useState(() => stats.map((stat) => formatStat(stat, 0)))

  useEffect(() => {
    setDisplayStats(stats.map((stat) => formatStat(stat, 0)))
    hasAnimatedRef.current = false
  }, [stats])

  useEffect(() => {
    const node = statsRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting || hasAnimatedRef.current) {
          return
        }

        hasAnimatedRef.current = true
        const duration = 1800
        const startedAt = performance.now()

        const tick = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)

          setDisplayStats(stats.map((stat) => formatStat(stat, eased)))

          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(tick)
          }
        }

        animationFrameRef.current = requestAnimationFrame(tick)
        observer.disconnect()
      },
      { threshold: 0.35 }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [stats])

  return (
    <section id="about" style={{ background: 'var(--cream)', padding: 'clamp(5rem, 10vw, 10rem) 4vw' }}>
      <div className="about-grid">
        {/* Text */}
        <div className="about-text reveal-left">
          <p className="section-label" style={{ color: 'var(--gold)' }}>
            {t('Unsere Geschichte', 'Our Story')}
          </p>
          <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--charcoal)' }}>
            {t('Wo jede', 'Where every')}<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>
              {t('Mahlzeit', 'Meal')}
            </em><br />
            {t('eine Geschichte erzählt', 'tells a Story')}
          </h2>
          <span className="gold-line" />
          <p style={{ fontSize: '1rem', lineHeight: 1.85, color: 'var(--brown-light)', fontWeight: 300, marginBottom: '1.5rem' }}>
            {t(
              'Im Herzen von Nebra (Unstrut) gelegen, ist die Neue Liebe mehr als ein Restaurant – es ist ein Ort, an dem Leidenschaft, Genuss und Herzlichkeit zusammenkommen. Unsere Küche vereint regionale Aromen mit modernen kulinarischen Akzenten.',
              'Located in the heart of Nebra (Unstrut), Neue Liebe is more than a restaurant – it is a place where passion, pleasure and warmth come together. Our cuisine unites regional flavors with modern culinary accents.'
            )}
          </p>
          <p style={{ fontSize: '1rem', lineHeight: 1.85, color: 'var(--brown-light)', fontWeight: 300, marginBottom: '1.5rem' }}>
            {t(
              'Ob ein romantisches Abendessen zu zweit, ein festliches Familienfest oder ein unvergesslicher Abend auf unserer Sommeterrasse – bei uns werden Momente zu Erinnerungen.',
              'Whether a romantic dinner for two, a festive family celebration, or an unforgettable evening on our summer terrace – with us, moments become memories.'
            )}
          </p>

          {/* Stats */}
          <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
            {stats.map((s, index) => (
              <div key={s.label} style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '1.2rem' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2.8rem', fontWeight: 300, color: 'var(--charcoal)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                  {displayStats[index]}
                </div>
                <div style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: '0.3rem', fontWeight: 300 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="about-visual reveal-right" style={{ position: 'relative' }}>
          <div style={{ position: 'relative', display: 'block', aspectRatio: '3 / 4' }}>
            <Image
              className="about-main-image"
              src="/german_food_1200.webp"
              alt={t('Restaurant Neue Liebe Interieur', 'Restaurant Neue Liebe interior')}
              fill
              loading="lazy"
              quality={62}
              sizes="(max-width: 768px) 92vw, (max-width: 1100px) 680px, 42vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div
            className="about-img-float"
            style={{
              position: 'absolute',
              bottom: '-2.5rem',
              left: '-2.5rem',
              width: '55%',
              aspectRatio: '1',
              border: '5px solid var(--cream)',
              overflow: 'hidden',
              display: 'block',
            }}
          >
            <Image
              src="/kulinarik_1600.webp"
              alt={t('Kulinarische Erlebnisse', 'Culinary experiences')}
              fill
              loading="lazy"
              quality={60}
              sizes="(max-width: 768px) 50vw, (max-width: 1100px) 374px, 24vw"
              style={{ objectFit: 'cover', borderRadius: 'inherit' }}
            />
          </div>
          {/* Badge */}
          <div className="about-badge" style={{
            position: 'absolute', top: '2rem', right: '-1rem',
            width: 100, height: 100,
            background: 'var(--gold)',
            borderRadius: '50%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Cormorant Garamond', serif",
            boxShadow: '0 8px 30px rgba(201,169,110,0.4)',
          }}>
            <span style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--charcoal)', lineHeight: 1 }}>★</span>
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--charcoal)', fontFamily: "'Jost', sans-serif", fontWeight: 400 }}>Premium</span>
          </div>
        </div>
      </div>
    </section>
  )
}
