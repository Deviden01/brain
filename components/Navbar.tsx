'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'

const VIEWS = [
  { href: '/', label: 'Otak' },
  { href: '/timeline', label: 'Timeline' },
]

// SVG Icons — no emoji
const BrainIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14"/>
  </svg>
)

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div className="fixed top-0 inset-x-0 z-50 pt-safe pointer-events-none px-3 sm:px-4">
      <div className="mx-auto max-w-2xl pt-2 sm:pt-3">
        <motion.header
          initial={{ opacity: 0, y: -16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex items-center justify-between gap-2 rounded-full px-3 sm:px-4"
          style={{
            height: '52px',
            background: 'rgba(10, 10, 15, 0.85)',
            backdropFilter: 'blur(36px)',
            WebkitBackdropFilter: 'blur(36px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 12px 40px -8px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.1) inset',
          }}
        >
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 select-none shrink-0 group min-w-0" aria-label="2nd Brain Home">
            <div
              className="flex items-center justify-center rounded-full text-indigo-400 shrink-0 transition-all duration-300 ease-[var(--easing)] group-hover:scale-110 group-hover:text-indigo-300"
              style={{
                width: '32px', height: '32px',
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.3)',
                boxShadow: '0 0 12px rgba(99,102,241,0.2)',
              }}
            >
              <BrainIcon />
            </div>
            <span className="font-bold tracking-tight text-sm sm:text-base whitespace-nowrap">
              <span className="text-indigo-400">2nd</span>
              <span className="text-white">Brain</span>
            </span>
          </Link>

          {/* Segmented control */}
          <nav
            className="flex items-center rounded-full p-1 shrink-0"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            aria-label="View switcher"
          >
            {VIEWS.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative flex items-center justify-center rounded-full font-semibold transition-colors duration-200"
                  style={{
                    padding: '6px 14px',
                    minHeight: '36px',
                    minWidth: '60px',
                    fontSize: '12px',
                    color: active ? '#fff' : 'rgba(148,163,184,1)',
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
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

          {/* CTA */}
          <Link
            href="/input"
            className="shrink-0 flex items-center justify-center gap-1.5 rounded-full font-semibold text-white transition-all duration-300 ease-[var(--easing)] hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              border: '1px solid rgba(99,102,241,0.4)',
              boxShadow: '0 0 18px rgba(99,102,241,0.3)',
              /* Mobile: square icon; desktop: pill with text */
              padding: '0 14px',
              height: '36px',
              minWidth: '36px',
              fontSize: '12px',
            }}
            aria-label="Catat Ide Baru"
          >
            <PlusIcon />
            <span className="hidden sm:inline">Catat Ide</span>
          </Link>
        </motion.header>
      </div>
    </div>
  )
}
