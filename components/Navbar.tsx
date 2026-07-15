'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'

const VIEWS = [
  { href: '/', label: 'Otak' },
  { href: '/timeline', label: 'Timeline' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed top-0 inset-x-0 z-50 h-16"
      style={{
        background: 'rgba(7, 8, 22, 0.85)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderBottom: '1px solid rgba(255,255,255,0.09)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 select-none shrink-0 group">
          <span className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shadow-lg shadow-indigo-500/10">
            ⚡
          </span>
          <span className="text-base font-extrabold tracking-tight">
            <span className="text-indigo-400">2nd</span>
            <span className="text-white">Brain</span>
          </span>
        </Link>

        {/* Segmented control — Otak / Timeline */}
        <nav
          className="flex items-center rounded-xl p-1 bg-white/[0.04] border border-white/[0.08]"
          aria-label="View switcher"
        >
          {VIEWS.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 sm:px-6 py-2 min-h-[38px] flex items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 ${
                  active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="seg-active"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                      boxShadow: '0 2px 14px rgba(99,102,241,0.4)',
                      zIndex: -1,
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  />
                )}
                {label}
              </Link>
            )
          })}
        </nav>

        {/* CTA — Simpan Ide */}
        <Link
          href="/input"
          className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 min-h-[38px] rounded-xl text-xs sm:text-sm font-semibold text-white transition-all duration-150 active:scale-95 shadow-lg shadow-indigo-500/25"
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Catat Ide</span>
        </Link>

      </div>
    </motion.header>
  )
}
