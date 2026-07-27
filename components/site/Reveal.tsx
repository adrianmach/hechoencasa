'use client'

import { useEffect, useRef, useState } from 'react'

type RevealVariant = 'up' | 'fade' | 'scale' | 'card' | 'line'

const VARIANT_CLASS: Record<RevealVariant, string> = {
  up: 'reveal-up',
  fade: 'reveal-fade',
  scale: 'reveal-scale',
  card: 'reveal-card',
  line: 'reveal-line',
}

export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children?: React.ReactNode
  variant?: RevealVariant
  delay?: number
  className?: string
  as?: 'div' | 'span'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={`${VARIANT_CLASS[variant]} ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
