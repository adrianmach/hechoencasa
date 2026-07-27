import { ProductForm } from '@/components/admin/ProductForm'

export default function NuevoProductoPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-brown">Nuevo producto</h1>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  )
}
