import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-5 text-brown">
      <h1 className="text-2xl font-semibold">No encontrado</h1>
      <Link href="/admin" className="text-chocolate underline">
        Volver al dashboard
      </Link>
    </div>
  )
}
