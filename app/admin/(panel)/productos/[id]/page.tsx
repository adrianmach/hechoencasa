import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/ProductForm'
import { createClient } from '@/lib/supabase/server'

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: product } = await supabase.from('products').select('*').eq('id', id).maybeSingle()

  if (!product) notFound()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brown">Editar producto</h1>
      <div className="mt-6">
        <ProductForm product={product} />
      </div>
    </div>
  )
}
