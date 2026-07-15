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
      className="fixed top-0 inset-x-0 z-50 h-14"
      style={{
        background: 'rgba(9, 9, 28, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="h-full max-w-3xl mx-auto px-4 flex items-center justify-between gap-3">

        {/* Brand */}
        <span className="text-sm font-bold select-none shrink-0 tracking-tight">
          <span className="text-indigo-400">2nd</span>
          <span className="text-white">Brain</span>
        </span>

        {/* Segmented control — Otak / Timeline */}
        <nav
          className="flex items-center rounded-xl p-0.5"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          aria-label="View switcher"
        >
          {VIEWS.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 py-1.5 rounded-[10px] text-sm font-medium transition-colors duration-200 ${
                  active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="seg-active"
                    className="absolute inset-0 rounded-[10px]"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                      boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
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
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
            boxShadow: '0 2px 10px rgba(99,102,241,0.30)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="hidden sm:inline">Simpan</span>
        </Link>

      </div>
    </motion.header>
  )
}
