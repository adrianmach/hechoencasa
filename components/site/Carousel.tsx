'use client'

import { useRef, useState } from 'react'

export function Carousel<T>({
  items,
  itemKey,
  itemClassName = '',
  gapClassName = 'gap-4 md:gap-6',
  renderItem,
}: {
  items: T[]
  itemKey: (item: T, index: number) => string
  itemClassName?: string
  gapClassName?: string
  renderItem: (item: T, index: number) => React.ReactNode
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [index, setIndex] = useState(0)
  const rafRef = useRef<number | null>(null)

  const count = items.length

  function updateIndexFromScroll() {
    if (rafRef.current != null) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      const container = scrollRef.current
      if (!container) return

      const center = container.scrollLeft + container.clientWidth / 2
      let closestIndex = 0
      let closestDistance = Infinity

      itemRefs.current.forEach((el, i) => {
        if (!el) return
        const elCenter = el.offsetLeft + el.offsetWidth / 2
        const distance = Math.abs(elCenter - center)
        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = i
        }
      })

      setIndex(closestIndex)
    })
  }

  function goTo(i: number) {
    const clamped = Math.max(0, Math.min(count - 1, i))
    itemRefs.current[clamped]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }

  if (count === 0) return null

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Anterior"
        onClick={() => goTo(index - 1)}
        disabled={index === 0}
        className="carousel-arrow left-2 lg:-left-5"
      >
        <span className="carousel-chevron carousel-chevron-left" />
      </button>
      <button
        type="button"
        aria-label="Siguiente"
        onClick={() => goTo(index + 1)}
        disabled={index === count - 1}
        className="carousel-arrow right-2 lg:-right-5"
      >
        <span className="carousel-chevron carousel-chevron-right" />
      </button>

      <div className="-mx-5 px-5 md:mx-0 md:px-0">
        <div
          ref={scrollRef}
          onScroll={updateIndexFromScroll}
          className={`flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-2 ${gapClassName} [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
        >
          {items.map((item, i) => (
            <div
              key={itemKey(item, i)}
              ref={(el) => {
                itemRefs.current[i] = el
              }}
              className={itemClassName}
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={itemKey(item, i)}
              type="button"
              aria-label={`Ir al ítem ${i + 1}`}
              onClick={() => goTo(i)}
              className={`carousel-dot ${i === index ? 'is-active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
