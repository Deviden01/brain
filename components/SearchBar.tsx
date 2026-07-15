'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Memory } from '@/types/memory'

interface SearchBarProps {
  memories: Memory[]
  onFilter: (filtered: Memory[]) => void
}

export default function SearchBar({ memories, onFilter }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleQuery = (q: string) => {
    setQuery(q)
    apply(q)
  }

  const selectItem = (title: string) => {
    setQuery(title)
    apply(title)
    setFocused(false)
  }

  const apply = (q: string) => {
    let result = memories
    if (q.trim()) {
      const lower = q.toLowerCase()
      result = result.filter(
        m =>
          (m.title || '').toLowerCase().includes(lower) ||
          (m.summary || '').toLowerCase().includes(lower) ||
          (m.content || m.raw_text || '').toLowerCase().includes(lower) ||
          (m.tags && m.tags.some(t => t.toLowerCase().includes(lower)))
      )
    }
    onFilter(result)
  }

  // Daftar judul yang muncul di dropdown
  const dropdownList = query.trim()
    ? memories.filter(
        m =>
          (m.title || '').toLowerCase().includes(query.toLowerCase()) ||
          (m.summary || '').toLowerCase().includes(query.toLowerCase())
      )
    : memories

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.35 }}
      className="relative w-full z-50"
    >
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle
              cx="6.5" cy="6.5" r="5"
              stroke={focused ? 'rgba(129,140,248,0.8)' : 'rgba(100,116,139,0.6)'}
              strokeWidth="1.5"
              style={{ transition: 'stroke 0.2s' }}
            />
            <path
              d="M10.5 10.5l3 3"
              stroke={focused ? 'rgba(129,140,248,0.8)' : 'rgba(100,116,139,0.6)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ transition: 'stroke 0.2s' }}
            />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={e => handleQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Cari judul, isi, atau ketik ide..."
          className="w-full h-11 pl-10 pr-10 text-base sm:text-sm text-slate-100 placeholder-slate-500 rounded-full outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            background: 'rgba(13, 15, 26, 0.65)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: focused
              ? '1px solid rgba(99,102,241,0.6)'
              : '1px solid rgba(255,255,255,0.08)',
            boxShadow: focused
              ? '0 0 24px -4px rgba(99,102,241,0.35), 0 1px 0 rgba(255,255,255,0.1) inset'
              : '0 4px 16px -4px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset',
          }}
        />

        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              onClick={() => handleQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Autocomplete Dropdown List */}
      <AnimatePresence>
        {focused && dropdownList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-full mt-2 py-2 max-h-[300px] overflow-y-auto rounded-2xl glass custom-scrollbar shadow-2xl z-50 border border-white/[0.08]"
            style={{ background: 'rgba(15,20,35,0.95)', backdropFilter: 'blur(24px)' }}
          >
            {dropdownList.map((m) => (
              <div
                key={m.id}
                onClick={() => selectItem(m.title)}
                className="px-4 py-2.5 mx-2 rounded-xl cursor-pointer hover:bg-indigo-500/10 transition-colors group flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {m.title}
                  </h4>
                  <span className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
                    {m.tags?.[0] || ''}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {m.summary}
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {focused && dropdownList.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute left-0 right-0 top-full mt-2 py-4 rounded-2xl glass text-center shadow-2xl z-50 border border-white/[0.08]"
            style={{ background: 'rgba(15,20,35,0.95)', backdropFilter: 'blur(24px)' }}
          >
            <p className="text-xs text-slate-500">Judul tidak ditemukan.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
