import Link from 'next/link'
import { goldButtonSecondary } from '@/lib/site/ui'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center gap-4 px-5 py-24 text-center">
      <h1 className="font-accent text-3xl text-text md:text-4xl">
        Página no <em className="italic">encontrada</em>
      </h1>
      <p className="font-body text-text/70">No encontramos lo que buscabas.</p>
      <Link href="/" className={`mt-2 ${goldButtonSecondary}`}>
        Volver al inicio
      </Link>
    </div>
  )
}
