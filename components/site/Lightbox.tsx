'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { Reveal } from '@/components/site/Reveal'
import { Carousel } from '@/components/site/Carousel'
import type { GalleryItem } from '@/types/database'

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState<GalleryItem | null>(null)

  function open(item: GalleryItem) {
    setActive(item)
    dialogRef.current?.showModal()
  }

  function close() {
    dialogRef.current?.close()
  }

  const spanClasses = [
    'row-span-2',
    '',
    'md:col-span-2',
    '',
    'row-span-2',
    '',
    '',
    'md:col-span-2',
  ]

  return (
    <>
      {/* Desktop / tablet: masonry con variación de tamaños */}
      <div className="hidden md:grid md:grid-cols-4 md:auto-rows-[180px] gap-4">
        {items.map((item, i) => (
          <Reveal
            key={item.id}
            variant="scale"
            delay={(i % 4) * 100}
            className={spanClasses[i % spanClasses.length]}
          >
          <button
            onClick={() => open(item)}
            className="group relative h-full w-full overflow-hidden rounded-[4px] bg-bg-alt"
          >
            <Image
              src={item.image_url}
              alt={item.caption ?? 'Foto de galería'}
              fill
              sizes="25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-text/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {item.caption && (
                <p className="p-4 font-body text-sm text-cream">{item.caption}</p>
              )}
            </div>
          </button>
          </Reveal>
        ))}
      </div>

      {/* Mobile: carrusel horizontal swipeable con flechas y dots */}
      <div className="md:hidden">
        <Carousel
          items={items}
          itemKey={(item) => item.id}
          itemClassName="relative aspect-[4/5] w-[78vw] max-w-xs shrink-0 snap-center overflow-hidden rounded-[4px] bg-bg-alt"
          gapClassName="gap-3"
          renderItem={(item) => (
            <button onClick={() => open(item)} className="h-full w-full">
              <Image
                src={item.image_url}
                alt={item.caption ?? 'Foto de galería'}
                fill
                sizes="78vw"
                className="object-cover"
              />
            </button>
          )}
        />
      </div>

      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) close()
        }}
        onClose={() => setActive(null)}
        className="lightbox-dialog m-auto w-[90vw] max-w-3xl border-none bg-transparent p-0"
      >
        {active && (
          <div className="relative w-full">
            <button
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-text/80 text-cream"
            >
              ✕
            </button>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={active.image_url}
                alt={active.caption ?? 'Foto de galería'}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
            {active.caption && (
              <p className="bg-text px-4 py-3 text-center font-body text-sm text-cream">
                {active.caption}
              </p>
            )}
          </div>
        )}
      </dialog>
    </>
  )
}
