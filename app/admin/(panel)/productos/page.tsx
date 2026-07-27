import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { ToastBanner } from '@/components/admin/ToastBanner'
import { ConfirmSubmitButton } from '@/components/admin/ConfirmSubmitButton'
import { createClient } from '@/lib/supabase/server'
import { deleteProduct, moveProduct, toggleProductActive } from '@/lib/actions/products'
import { CATEGORY_LABEL } from '@/lib/categories'
import type { Product, ProductCategory } from '@/types/database'

export default async function AdminProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>
}) {
  const { categoria } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('products').select('*').order('sort_order', { ascending: true })
  if (categoria) query = query.eq('category', categoria as ProductCategory)
  const { data: products } = (await query) as { data: Product[] | null }

  return (
    <div>
      <Suspense>
        <ToastBanner />
      </Suspense>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-brown">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-md bg-chocolate px-4 py-2.5 text-sm font-medium text-warm-white hover:bg-caramel"
        >
          Nuevo producto
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <CategoryLink label="Todos" href="/admin/productos" active={!categoria} />
        {(Object.keys(CATEGORY_LABEL) as ProductCategory[]).map((cat) => (
          <CategoryLink
            key={cat}
            label={CATEGORY_LABEL[cat]}
            href={`/admin/productos?categoria=${cat}`}
            active={categoria === cat}
          />
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-soft bg-warm-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-soft text-brown/60">
              <th className="p-3 font-medium">Imagen</th>
              <th className="p-3 font-medium">Nombre</th>
              <th className="p-3 font-medium">Categoría</th>
              <th className="p-3 font-medium">Precio</th>
              <th className="p-3 font-medium">Estado</th>
              <th className="p-3 font-medium">Orden</th>
              <th className="p-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((product) => (
              <tr key={product.id} className="border-b border-soft last:border-0">
                <td className="p-3">
                  {product.image_url && (
                    <div className="relative h-12 w-12 overflow-hidden rounded-md">
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                    </div>
                  )}
                </td>
                <td className="p-3 font-medium text-brown">{product.name}</td>
                <td className="p-3 text-brown/80">{CATEGORY_LABEL[product.category]}</td>
                <td className="p-3 text-brown/80">
                  {product.price_type === 'fixed' ? `$${product.price}` : 'Cotización'}
                </td>
                <td className="p-3">
                  <form action={toggleProductActive}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="current" value={String(product.is_active)} />
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.is_active
                          ? 'bg-caramel/20 text-chocolate'
                          : 'bg-soft/60 text-brown/60'
                      }`}
                    >
                      {product.is_active ? 'Activo' : 'Inactivo'}
                    </button>
                  </form>
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <form action={moveProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        aria-label="Subir"
                        className="rounded border border-soft px-2 py-1 hover:bg-cream"
                      >
                        ↑
                      </button>
                    </form>
                    <form action={moveProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        aria-label="Bajar"
                        className="rounded border border-soft px-2 py-1 hover:bg-cream"
                      >
                        ↓
                      </button>
                    </form>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="font-medium text-chocolate hover:underline"
                    >
                      Editar
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <ConfirmSubmitButton
                        confirmMessage={`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`}
                        className="font-medium text-red-700 hover:underline"
                      >
                        Eliminar
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(products ?? []).length === 0 && (
          <p className="p-6 text-center text-brown/60">No hay productos todavía.</p>
        )}
      </div>
    </div>
  )
}

function CategoryLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
        active ? 'border-chocolate bg-chocolate text-warm-white' : 'border-soft text-brown hover:border-chocolate'
      }`}
    >
      {label}
    </Link>
  )
}
