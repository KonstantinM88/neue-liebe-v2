'use client'

import { useEffect, useRef, useState, type ComponentPropsWithoutRef } from 'react'

type LazyVideoProps = Omit<ComponentPropsWithoutRef<'video'>, 'src'> & {
  src: string
  rootMargin?: string
}

export default function LazyVideo({
  src,
  rootMargin = '240px 0px',
  autoPlay = true,
  preload,
  ...props
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || shouldLoad) return

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, shouldLoad])

  useEffect(() => {
    if (shouldLoad) {
      ref.current?.load()
    }
  }, [shouldLoad])

  return (
    <video
      {...props}
      ref={ref}
      src={shouldLoad ? src : undefined}
      autoPlay={shouldLoad ? autoPlay : false}
      preload={shouldLoad ? preload ?? 'metadata' : 'none'}
    />
  )
}
