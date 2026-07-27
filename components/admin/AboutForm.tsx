'use client'

import Image from 'next/image'
import { useState, useTransition } from 'react'
import { resizeImage } from '@/lib/image'
import { updateAbout } from '@/lib/actions/config'
import type { AboutConfig } from '@/types/database'

export function AboutForm({ about }: { about: AboutConfig }) {
  const [text, setText] = useState(about.text)
  const [preview, setPreview] = useState(about.image_url)
  const [pendingFile, setPendingFile] = useState<Blob | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const resized = await resizeImage(file)
      setPendingFile(resized)
      setPreview(URL.createObjectURL(resized))
    } catch {
      setError('No se pudo procesar la imagen.')
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData()
    formData.set('text', text)
    formData.set('current_image_url', about.image_url)
    if (pendingFile) formData.set('image', pendingFile, 'about.jpg')

    startTransition(async () => {
      try {
        await updateAbout(formData)
      } catch (err) {
        if (err instanceof Error && err.message !== 'NEXT_REDIRECT') setError(err.message)
      }
    })
  }

  const inputClass =
    'w-full rounded-md border border-soft bg-cream px-3 py-2.5 text-brown focus:border-chocolate focus:outline-none'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-brown">Texto &quot;Sobre mí&quot;</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-brown">Foto</span>
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
        {preview && (
          <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-lg border border-soft">
            <Image src={preview} alt="Vista previa" fill className="object-cover" unoptimized />
          </div>
        )}
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-md bg-chocolate px-5 py-2.5 text-sm font-medium text-warm-white hover:bg-caramel disabled:opacity-60"
      >
        {isPending ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  )
}
