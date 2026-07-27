import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import '../globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Panel admin',
    template: '%s — Panel admin',
  },
  robots: { index: false, follow: false },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body className="min-h-screen bg-cream antialiased">{children}</body>
    </html>
  )
}
