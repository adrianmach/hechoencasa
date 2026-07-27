'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { resizeImage } from '@/lib/image'
import {
  deleteGalleryItem,
  moveGalleryItem,
  updateGalleryCaption,
  uploadGalleryImage,
} from '@/lib/actions/gallery'
import { ConfirmSubmitButton } from '@/components/admin/ConfirmSubmitButton'
import type { GalleryItem } from '@/types/database'

export function GalleryManager({ items }: { items: GalleryItem[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [uploadingCount, setUploadingCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setError(null)
    setUploadingCount(files.length)

    for (const file of files) {
      try {
        const resized = await resizeImage(file)
        const formData = new FormData()
        formData.set('image', resized, 'gallery.jpg')
        const result = await uploadGalleryImage(formData)
        if (result?.error) setError(result.error)
      } catch {
        setError('No se pudo subir una de las imágenes.')
      }
      setUploadingCount((c) => Math.max(0, c - 1))
    }

    router.refresh()
    e.target.value = ''
  }

  return (
    <div>
      <label className="block w-fit cursor-pointer rounded-md bg-chocolate px-4 py-2.5 text-sm font-medium text-warm-white hover:bg-caramel">
        {uploadingCount > 0 ? `Subiendo ${uploadingCount}...` : 'Subir imágenes'}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
          disabled={uploadingCount > 0}
        />
      </label>

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <div key={item.id} className="rounded-lg border border-soft bg-warm-white p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md">
              <Image src={item.image_url} alt={item.caption ?? ''} fill className="object-cover" />
            </div>

            <form
              action={(formData) => {
                startTransition(async () => {
                  await updateGalleryCaption(formData)
                })
              }}
              className="mt-2 flex gap-2"
            >
              <input type="hidden" name="id" value={item.id} />
              <input
                name="caption"
                defaultValue={item.caption ?? ''}
                placeholder="Descripción"
                className="w-full rounded border border-soft px-2 py-1.5 text-sm"
                onBlur={(e) => e.currentTarget.form?.requestSubmit()}
              />
            </form>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-1">
                <form action={moveGalleryItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={i === 0}
                    className="rounded border border-soft px-2 py-1 text-sm hover:bg-cream disabled:opacity-30"
                  >
                    ↑
                  </button>
                </form>
                <form action={moveGalleryItem}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={i === items.length - 1}
                    className="rounded border border-soft px-2 py-1 text-sm hover:bg-cream disabled:opacity-30"
                  >
                    ↓
                  </button>
                </form>
              </div>

              <form action={deleteGalleryItem}>
                <input type="hidden" name="id" value={item.id} />
                <ConfirmSubmitButton
                  confirmMessage="¿Eliminar esta foto de la galería?"
                  className="text-sm font-medium text-red-700 hover:underline"
                >
                  Eliminar
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && !isPending && (
        <p className="mt-6 text-brown/60">Todavía no subiste fotos a la galería.</p>
      )}
    </div>
  )
}
