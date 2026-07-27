import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ count: activeCount }, { data: lastProduct }] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase
      .from('products')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brown">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-soft bg-warm-white p-5">
          <p className="text-sm text-brown/60">Productos activos</p>
          <p className="mt-1 text-3xl font-semibold text-brown">{activeCount ?? 0}</p>
        </div>
        <div className="rounded-lg border border-soft bg-warm-white p-5">
          <p className="text-sm text-brown/60">Último producto modificado</p>
          <p className="mt-1 text-lg font-medium text-brown">{lastProduct?.name ?? '—'}</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/productos/nuevo"
          className="rounded-md bg-chocolate px-4 py-2.5 text-sm font-medium text-warm-white hover:bg-caramel"
        >
          Agregar producto
        </Link>
        <Link
          href="/admin/galeria"
          className="rounded-md border border-soft px-4 py-2.5 text-sm font-medium text-brown hover:bg-cream"
        >
          Subir fotos a la galería
        </Link>
        <Link
          href="/admin/configuracion"
          className="rounded-md border border-soft px-4 py-2.5 text-sm font-medium text-brown hover:bg-cream"
        >
          Editar configuración del sitio
        </Link>
      </div>
    </div>
  )
}
