import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
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
  themeColor: '#05050A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={inter.className}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
