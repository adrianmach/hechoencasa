'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { whatsappLink } from '@/lib/whatsapp'
import { navLink } from '@/lib/site/ui'

const LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/cotizar', label: 'Pedí tu presupuesto' },
  { href: '/galeria', label: 'Galería' },
  { href: '/sobre-mi', label: 'Sobre mí' },
  { href: '/faq', label: 'FAQ' },
]

const LEFT_LINKS = LINKS.slice(0, 3)
const RIGHT_LINKS = LINKS.slice(3)

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)

  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setOpen(false)
  }

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b border-gold/20 bg-cream transition-[padding] duration-300 ${
        scrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 items-center px-5 md:grid-cols-[1fr_auto_1fr]">
        <nav className="hidden items-center gap-7 md:flex">
          {LEFT_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${navLink} ${pathname === link.href ? 'after:scale-x-100' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="justify-self-start outline-none md:col-start-2 md:justify-self-center"
        >
          <Image
            src="/logo.png"
            alt="Hecho en Casa"
            width={120}
            height={120}
            priority
            className="h-[110px] w-auto border-none bg-transparent object-contain outline-none md:h-[120px]"
          />
        </Link>

        <div className="col-start-2 flex items-center justify-end gap-7 md:col-start-3">
          <nav className="hidden items-center gap-7 md:flex">
            {RIGHT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${navLink} ${pathname === link.href ? 'after:scale-x-100' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <a
            href={whatsappLink('Hola! Quiero hacer una consulta.')}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden border border-gold px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.12em] text-gold transition-colors duration-300 hover:bg-gold hover:text-cream md:inline-block"
          >
            WhatsApp
          </a>

          <button
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-px w-6 bg-text transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`}
            />
            <span className={`h-px w-6 bg-text transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span
              className={`h-px w-6 bg-text transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu-overlay fixed inset-0 top-0 z-[60] flex flex-col items-center justify-center gap-8 bg-cream md:hidden">
          <button
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-6 flex h-10 w-10 items-center justify-center text-2xl text-text"
          >
            ✕
          </button>
          {LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="mobile-menu-link font-accent text-2xl text-text"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={whatsappLink('Hola! Quiero hacer una consulta.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-menu-link mt-4 border border-gold px-6 py-3 font-body text-xs font-medium uppercase tracking-[0.12em] text-gold"
            style={{ animationDelay: `${LINKS.length * 80}ms` }}
          >
            WhatsApp
          </a>
        </div>
      )}
    </header>
  )
}
