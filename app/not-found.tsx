import Link from 'next/link'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  weight: ['400'],
  display: 'swap',
})

export default function NotFound() {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream font-body text-text antialiased">
        <h1 className="font-accent text-3xl">Página no encontrada</h1>
        <Link href="/" className="text-gold underline">
          Volver al inicio
        </Link>
      </body>
    </html>
  )
}
