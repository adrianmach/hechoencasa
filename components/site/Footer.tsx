import Image from 'next/image'
import Link from 'next/link'
import { whatsappLink } from '@/lib/whatsapp'
import type { ContactConfig } from '@/types/database'

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M16.6 5.82c-.9-.6-1.53-1.55-1.71-2.65h-2.5v13.06a2.6 2.6 0 1 1-1.85-2.49v-2.53a5.1 5.1 0 1 0 4.35 5.02V9.4a7.6 7.6 0 0 0 4.43 1.42V8.32a5 5 0 0 1-2.72-2.5Z" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.14.82.84-3.06-.2-.31a8.15 8.15 0 0 1-1.26-4.35c0-4.51 3.68-8.19 8.2-8.19 2.19 0 4.25.86 5.8 2.4a8.13 8.13 0 0 1 2.4 5.8c0 4.51-3.68 8.2-8.15 8.2Z" />
    </svg>
  )
}

export function Footer({ contact }: { contact: ContactConfig }) {
  return (
    <footer className="bg-text text-cream">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="mx-auto h-px w-[60px] bg-gold" />

        <div className="mt-8 flex justify-center">
          <Image
            src="/logo.png"
            alt="Hecho en Casa"
            width={120}
            height={120}
            className="h-[120px] w-[120px] object-contain brightness-0 invert"
          />
        </div>
        <p className="mt-2 text-center font-body text-xs uppercase tracking-[0.15em] text-cream/60">
          Pastelería artesanal{contact.neighborhood ? ` · ${contact.neighborhood}` : ''}
        </p>

        <div className="mt-8 flex justify-center gap-6">
          <a
            href={whatsappLink('Hola! Quiero hacer una consulta.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-cream transition-colors duration-300 hover:text-gold"
          >
            <WhatsAppIcon />
          </a>
          {contact.instagram && (
            <a
              href={`https://instagram.com/${contact.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-cream transition-colors duration-300 hover:text-gold"
            >
              <InstagramIcon />
            </a>
          )}
          {contact.tiktok && (
            <a
              href={`https://tiktok.com/@${contact.tiktok.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-cream transition-colors duration-300 hover:text-gold"
            >
              <TikTokIcon />
            </a>
          )}
        </div>

        <nav className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 font-body text-sm font-light text-cream/80">
          <Link href="/catalogo" className="transition-colors duration-300 hover:text-gold">
            Catálogo
          </Link>
          <Link href="/cotizar" className="transition-colors duration-300 hover:text-gold">
            Pedí tu presupuesto
          </Link>
          <Link href="/galeria" className="transition-colors duration-300 hover:text-gold">
            Galería
          </Link>
          <Link href="/faq" className="transition-colors duration-300 hover:text-gold">
            Preguntas frecuentes
          </Link>
        </nav>

        <div className="mt-8 flex flex-col items-center gap-1 font-body text-xs font-light text-cream/50">
          {contact.delivery_zone && <p>{contact.delivery_zone}</p>}
          {contact.hours && <p>{contact.hours}</p>}
        </div>

        <p className="mt-6 text-center font-body text-xs font-light text-cream/40">
          &copy; {new Date().getFullYear()} Hecho en Casa
        </p>
      </div>
    </footer>
  )
}
