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
    <div className="fixed top-4 sm:top-5 inset-x-0 mx-auto max-w-2xl px-4 z-50 pointer-events-none">
      <motion.header
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto h-14 rounded-full px-4 sm:px-5 flex items-center justify-between gap-3 transition-all duration-300 group/nav"
        style={{
          background: 'rgba(13, 15, 26, 0.75)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          boxShadow: '0 12px 40px -10px rgba(0, 0, 0, 0.7), 0 1px 0 rgba(255, 255, 255, 0.12) inset',
        }}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 select-none shrink-0 group">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:border-indigo-400/60 group-hover:bg-indigo-500/30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_15px_rgba(99,102,241,0.25)]">
            <span className="text-sm">⚡</span>
          </div>
          <span className="text-sm sm:text-base font-extrabold tracking-tight">
            <span className="text-indigo-400">2nd</span>
            <span className="text-white">Brain</span>
          </span>
        </Link>

        {/* Segmented control — Otak / Timeline */}
        <nav
          className="flex items-center rounded-full p-1 bg-white/[0.04] border border-white/[0.06]"
          aria-label="View switcher"
        >
          {VIEWS.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-4 sm:px-5 py-1.5 min-h-[34px] flex items-center justify-center rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 ${
                  active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="seg-active-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                      boxShadow: '0 2px 16px rgba(99,102,241,0.45)',
                      zIndex: -1,
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                {label}
              </Link>
            )
          })}
        </nav>

        {/* CTA — Catat Ide */}
        <Link
          href="/input"
          className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-1.5 min-h-[34px] rounded-full text-xs sm:text-sm font-semibold text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_28px_rgba(99,102,241,0.6)] border border-indigo-400/30"
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="hidden sm:inline">Catat Ide</span>
        </Link>
      </motion.header>
    </div>
  )
}
