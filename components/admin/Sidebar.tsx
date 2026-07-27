'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/actions/auth'

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/productos', label: 'Productos' },
  { href: '/admin/galeria', label: 'Galería' },
  { href: '/admin/testimonios', label: 'Testimonios' },
  { href: '/admin/configuracion', label: 'Configuración' },
]

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname()

  return (
    <aside className="flex w-full shrink-0 flex-col justify-between border-b border-soft bg-warm-white p-5 md:h-screen md:w-56 md:border-b-0 md:border-r">
      <div>
        <p className="font-accent text-lg italic text-brown">Hecho en Casa</p>
        <nav className="mt-6 flex flex-row gap-1 overflow-x-auto md:flex-col">
          {LINKS.map((link) => {
            const active = link.href === '/admin' ? pathname === '/admin' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ${
                  active ? 'bg-chocolate text-warm-white' : 'text-brown hover:bg-cream'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-6 hidden md:block">
        <p className="truncate text-xs text-brown/60">{email}</p>
        <form action={signOut}>
          <button
            type="submit"
            className="mt-2 w-full rounded-md border border-soft px-3 py-2 text-sm text-brown hover:bg-cream"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  )
}
