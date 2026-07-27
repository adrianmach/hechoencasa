import { GalleryManager } from '@/components/admin/GalleryManager'
import { createClient } from '@/lib/supabase/server'

export default async function AdminGaleriaPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('gallery')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-semibold text-brown">Galería</h1>
      <p className="mt-1 text-brown/70">Subí, ordená y describí las fotos de trabajos.</p>

      <div className="mt-6">
        <GalleryManager items={items ?? []} />
      </div>
    </div>
  )
}
