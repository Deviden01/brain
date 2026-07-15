'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '@/components/Navbar'
import BrainCanvas from '@/components/BrainCanvas'
import SearchBar from '@/components/SearchBar'
import { Memory } from '@/types/memory'

// SVG Icons — no emoji
const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
)

const SpinnerIcon = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeOpacity="0.3"/>
    <path d="M12 2v4" strokeOpacity="1"/>
  </svg>
)

const GLASS_CARD = {
  background: 'rgba(10, 10, 15, 0.8)',
  backdropFilter: 'blur(32px)',
  WebkitBackdropFilter: 'blur(32px)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 16px 48px -12px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.1) inset',
} as const

const GLASS_MODAL = {
  background: 'rgba(10, 10, 20, 0.95)',
  backdropFilter: 'blur(40px)',
  WebkitBackdropFilter: 'blur(40px)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: '0 32px 80px -16px rgba(0,0,0,0.95), 0 1px 0 rgba(255,255,255,0.15) inset',
} as const

export default function HomePage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [filtered, setFiltered] = useState<Memory[]>([])
  const [rawText, setRawText] = useState('')
  const [titleText, setTitleText] = useState('')
  const [isDumping, setIsDumping] = useState(false)
  const [isMobileDumpOpen, setIsMobileDumpOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    fetch('/api/memory')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) { setMemories(data); setFiltered(data) }
      })
      .catch(err => console.error('Gagal load data', err))
  }, [])

  const handleDump = async () => {
    if (!rawText.trim()) return
    setIsDumping(true)
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, title: titleText }),
      })
      const newMemory = await res.json()
      if (newMemory?.id) {
        setMemories(prev => [newMemory, ...prev])
        setFiltered(prev => [newMemory, ...prev])
        setRawText(''); setTitleText(''); setIsExpanded(false); setIsMobileDumpOpen(false)
      } else {
        alert('Gagal dump: ' + JSON.stringify(newMemory))
      }
    } catch (e) {
      alert('Error: ' + e)
    } finally {
      setIsDumping(false)
    }
  }

  const kpiStats = [
    { label: 'Memori', value: memories.length },
    { label: 'Tag', value: [...new Set(memories.flatMap(m => m.tags || []))].length },
    { label: 'Hari', value: new Set(memories.map(m => m.created_at ? new Date(m.created_at).toISOString().slice(0, 10) : '')).size },
  ]

  return (
    <main className="h-dvh w-full flex flex-col overflow-hidden relative">

      {/* Ambient blobs — purely decorative */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="blob absolute top-[15%] left-[10%] w-[50vw] h-[50vw] max-w-[480px] max-h-[480px] rounded-full bg-indigo-600/12 blur-[100px]" />
        <div className="blob blob-delay absolute bottom-[10%] right-[8%] w-[40vw] h-[40vw] max-w-[360px] max-h-[360px] rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      {/* Navbar (fixed, z-50) */}
      <Navbar />

      {/* Brain Canvas — fills full screen behind overlays */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <BrainCanvas memories={filtered} />
      </div>

      {/* Floating UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between px-3 sm:px-5 pb-safe"
        style={{ paddingTop: 'max(72px, calc(52px + env(safe-area-inset-top, 0px) + 8px))' }}>

        {/* ── Top Row: Header Island + Search ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 max-w-7xl mx-auto w-full">

          {/* Header island */}
          <motion.div
            initial={{ opacity: 0, x: -16, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto rounded-2xl p-4 sm:p-5"
            style={GLASS_CARD}
          >
            <h1 className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight mb-0.5">
              Memory <span className="text-indigo-400 font-light italic">Galaxy</span>
            </h1>
            <p className="text-[var(--fg-muted)] text-[11px] sm:text-xs">
              {memories.length} memori · Jelajahi klaster ide &amp; transkrip
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="w-full sm:w-72 pointer-events-auto"
          >
            <SearchBar memories={memories} onFilter={setFiltered} />
            {filtered.length === 0 && (
              <div className="mt-2 text-center py-2 rounded-xl text-[var(--fg-muted)] text-xs border border-white/10"
                style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
                Tidak ada memori yang cocok.
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Bottom Row: Dock + KPI ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3 max-w-4xl mx-auto w-full pointer-events-none mb-2 sm:mb-4"
        >
          {/* Desktop prompt capsule */}
          <div className="hidden md:block w-full pointer-events-auto">
            <div className="rounded-2xl p-4 transition-all duration-300 ease-[var(--easing)]" style={GLASS_CARD}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full text-indigo-400"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 0 10px rgba(99,102,241,0.25)' }}>
                    <ZapIcon />
                  </div>
                  <span className="text-white text-sm font-semibold">AI Quick Dump</span>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-[var(--fg-muted)] hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-full hover:bg-white/[0.06] border border-transparent hover:border-white/10 min-h-[32px]"
                >
                  {isExpanded ? 'Tutup' : '+ Judul Manual'}
                </button>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden mb-3">
                    <input type="text" value={titleText} onChange={e => setTitleText(e.target.value)}
                      placeholder="Judul Catatan (opsional)"
                      className="w-full bg-black/40 text-sm text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500/70 transition-all placeholder:text-[var(--fg-muted)]" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 items-center">
                <textarea value={rawText} onChange={e => setRawText(e.target.value)}
                  placeholder="Paste obrolan / ide panjang... AI akan merangkum &amp; menata otomatis."
                  className="flex-1 bg-black/40 text-sm text-white px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500/70 resize-none transition-all placeholder:text-[var(--fg-muted)] leading-snug"
                  style={{ height: '52px' }} />
                <button onClick={handleDump} disabled={isDumping || !rawText.trim()}
                  className="shrink-0 flex items-center justify-center gap-2 px-5 rounded-xl text-white text-sm font-semibold transition-all duration-300 ease-[var(--easing)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95 border border-indigo-400/30"
                  style={{ height: '52px', background: 'linear-gradient(135deg,#4f46e5,#6366f1)', boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}>
                  {isDumping ? <><SpinnerIcon /><span>Ekstrak...</span></> : <><ZapIcon /><span>Dump</span></>}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile bottom row */}
          <div className="flex items-center w-full gap-3 pointer-events-auto">
            {/* Quick Dump trigger */}
            <button onClick={() => setIsMobileDumpOpen(true)}
              className="md:hidden flex-1 flex items-center justify-center gap-2 rounded-full text-white text-sm font-semibold transition-all duration-300 ease-[var(--easing)] active:scale-95 cursor-pointer border border-indigo-400/30"
              style={{ minHeight: '48px', background: 'linear-gradient(135deg,#4f46e5,#6366f1)', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}
              aria-label="Buka Quick Dump AI">
              <ZapIcon />
              <span>Quick Dump AI</span>
            </button>

            {/* KPI pill */}
            <div className="flex items-center rounded-full shrink-0 overflow-hidden" style={{
              background: 'rgba(10,10,15,0.85)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.1) inset',
            }}>
              {kpiStats.map(({ label, value }, i) => (
                <div key={label} className={`px-3 py-2.5 flex flex-col items-center ${i > 0 ? 'border-l border-white/08' : ''}`}>
                  <span className="text-sm font-bold text-white leading-none">{value}</span>
                  <span className="text-[9px] text-[var(--fg-muted)] uppercase tracking-wider font-medium mt-0.5">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Quick Dump Modal */}
      <AnimatePresence>
        {isMobileDumpOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 pointer-events-auto"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={() => setIsMobileDumpOpen(false)}>
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl p-6 pb-safe max-h-[90dvh] overflow-y-auto"
              style={GLASS_MODAL}
              onClick={e => e.stopPropagation()}>

              {/* Drag handle */}
              <div className="w-10 h-1 rounded-full mx-auto mb-5 sm:hidden" style={{ background: 'rgba(255,255,255,0.2)' }} />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full text-indigo-400"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 0 12px rgba(99,102,241,0.25)' }}>
                    <ZapIcon />
                  </div>
                  <h2 className="text-white text-base font-semibold">Quick Dump AI</h2>
                </div>
                <button onClick={() => setIsMobileDumpOpen(false)}
                  className="flex items-center justify-center rounded-xl text-[var(--fg-muted)] hover:text-white transition-colors hover:bg-white/[0.07] cursor-pointer"
                  style={{ width: '44px', height: '44px' }} aria-label="Tutup">
                  <XIcon />
                </button>
              </div>

              <p className="text-[var(--fg-muted)] text-xs mb-4 leading-relaxed">
                Biarkan judul kosong untuk rangkuman otomatis AI.
              </p>

              <input type="text" value={titleText} onChange={e => setTitleText(e.target.value)}
                placeholder="Judul Catatan (opsional)"
                className="w-full bg-black/40 text-base text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500/70 mb-3 placeholder:text-[var(--fg-muted)] transition-all" />

              <textarea value={rawText} onChange={e => setRawText(e.target.value)}
                placeholder="Paste transkrip / catatan panjang di sini..."
                className="w-full bg-black/40 text-base text-white p-4 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500/70 resize-none mb-4 placeholder:text-[var(--fg-muted)] transition-all"
                style={{ height: '144px' }} />

              <button onClick={handleDump} disabled={isDumping || !rawText.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl text-white text-sm font-semibold transition-all duration-300 ease-[var(--easing)] disabled:opacity-40 cursor-pointer active:scale-95 border border-indigo-400/30"
                style={{ minHeight: '52px', background: 'linear-gradient(135deg,#4f46e5,#6366f1)', boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}>
                {isDumping
                  ? <><SpinnerIcon /><span>Mengekstrak...</span></>
                  : <><ZapIcon /><span>Simpan &amp; Dump ke Galaksi</span></>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
