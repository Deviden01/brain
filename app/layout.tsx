import type { Metadata, Viewport } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: '2nd Brain — Memorized Everything',
  description: 'Simpan, proses, dan panggil kembali semua ide dan percakapan penting kamu secara otomatis dengan AI.',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: '2nd Brain',
    description: 'Memorized Everything',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#020203',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${cormorant.variable}`}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
