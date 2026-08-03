'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { resizeImage } from '@/lib/image'
import { upsertProduct } from '@/lib/actions/products'
import type { Product } from '@/types/database'

const CATEGORIES: { value: Product['category']; label: string }[] = [
  { value: 'tortas', label: 'Tortas' },
  { value: 'postres', label: 'Postres' },
  { value: 'alfajores', label: 'Alfajores' },
  { value: 'temporada', label: 'Temporada' },
  { value: 'cookies', label: 'Cookies' },
]

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter()
  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [category, setCategory] = useState<Product['category']>(product?.category ?? 'alfajores')
  const [priceType, setPriceType] = useState<Product['price_type']>(product?.price_type ?? 'fixed')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [preview, setPreview] = useState(product?.image_url ?? '')
  const [pendingFile, setPendingFile] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const slugPreview = slugifyPreview(name)

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
    setError(null)

    if (!name.trim()) {
      setError('El nombre es obligatorio.')
      return
    }
    if (priceType === 'fixed' && !price) {
      setError('Ingresá un precio para este producto.')
      return
    }

    const formData = new FormData()
    if (product) formData.set('id', product.id)
    formData.set('name', name.trim())
    formData.set('description', description.trim())
    formData.set('category', category)
    formData.set('price_type', priceType)
    formData.set('price', priceType === 'fixed' ? price : '')
    formData.set('is_active', isActive ? 'on' : 'off')
    formData.set('current_image_url', product?.image_url ?? '')
    if (pendingFile) {
      formData.set('image', pendingFile, 'product.jpg')
    }

    startTransition(async () => {
      try {
        await upsertProduct(formData)
      } catch (err) {
        // Next throws a special redirect error on success; only real errors land here.
        if (err instanceof Error && err.message !== 'NEXT_REDIRECT') {
          setError(err.message)
        }
      }
    })
  }

  const inputClass =
    'w-full rounded-md border border-soft bg-warm-white px-3 py-2.5 text-brown focus:border-chocolate focus:outline-none'
  const labelClass = 'text-sm font-medium text-brown'

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Nombre</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Ej: Alfajores de maicena (x6)"
        />
        {slugPreview && <span className="text-xs text-brown/50">slug: {slugPreview}</span>}
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Descripción</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          rows={4}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Categoría</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Product['category'])}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex flex-col gap-1.5">
        <span className={labelClass}>Tipo de precio</span>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-brown">
            <input
              type="radio"
              checked={priceType === 'fixed'}
              onChange={() => setPriceType('fixed')}
            />
            Precio fijo
          </label>
          <label className="flex items-center gap-2 text-sm text-brown">
            <input
              type="radio"
              checked={priceType === 'quote'}
              onChange={() => setPriceType('quote')}
            />
            A cotizar
          </label>
        </div>
      </div>

      {priceType === 'fixed' && (
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Precio ($)</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </label>
      )}

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Imagen</span>
        <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
        {preview && (
          <div className="relative mt-2 h-40 w-40 overflow-hidden rounded-lg border border-soft">
            <Image src={preview} alt="Vista previa" fill className="object-cover" unoptimized />
          </div>
        )}
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        <span className="text-sm text-brown">Producto activo (visible en el sitio)</span>
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-chocolate px-5 py-2.5 text-sm font-medium text-warm-white hover:bg-caramel disabled:opacity-60"
        >
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/productos')}
          className="rounded-md border border-soft px-5 py-2.5 text-sm font-medium text-brown hover:bg-cream"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function slugifyPreview(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
