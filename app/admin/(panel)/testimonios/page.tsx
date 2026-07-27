import { Suspense } from 'react'
import { ToastBanner } from '@/components/admin/ToastBanner'
import { TestimonialManager } from '@/components/admin/TestimonialManager'
import { createClient } from '@/lib/supabase/server'

export default async function AdminTestimoniosPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div>
      <Suspense>
        <ToastBanner />
      </Suspense>

      <h1 className="text-2xl font-semibold text-brown">Testimonios</h1>
      <p className="mt-1 text-brown/70">
        Los testimonios activos se muestran en la home. Podés agregar, editar, desactivar o
        eliminar.
      </p>

      <div className="mt-6">
        <TestimonialManager items={items ?? []} />
      </div>
    </div>
  )
}
