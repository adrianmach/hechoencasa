import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import '../globals.css'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { WhatsAppFloat } from '@/components/site/WhatsAppFloat'
import { PageFadeIn } from '@/components/site/PageFadeIn'
import { getActiveProducts, getSiteConfig } from '@/lib/data'

// Solo se cargan los pesos/estilos que realmente se usan en el sitio
// (font-accent siempre en peso 400, normal o italic; font-body nunca en italic).
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  weight: ['400'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
  style: ['normal'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

const SITE_TITLE = 'Hecho en Casa — Pastelería artesanal en Montevideo'
const SITE_DESCRIPTION =
  'Tortas personalizadas, postres y alfajores artesanales. Pedidos por WhatsApp.'

export async function generateMetadata(): Promise<Metadata> {
  const products = await getActiveProducts()
  const ogImage = products[0]?.image_url

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: {
      default: SITE_TITLE,
      template: '%s — Hecho en Casa',
    },
    description: SITE_DESCRIPTION,
    openGraph: {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      type: 'website',
      locale: 'es_UY',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const config = await getSiteConfig()

  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable} h-full`}>
      <head>
        <meta name="vercel-toolbar" content="disabled" />
      </head>
      <body className="flex min-h-full flex-col bg-cream font-body text-text antialiased">
        <Header />
        <main className="flex-1">
          <PageFadeIn>{children}</PageFadeIn>
        </main>
        <Footer contact={config.contact} />
        <WhatsAppFloat />
      </body>
    </html>
  )
}
