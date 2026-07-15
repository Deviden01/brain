'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Navbar from '@/components/Navbar'
import BrainCanvas from '@/components/BrainCanvas'
import SearchBar from '@/components/SearchBar'
import { Memory } from '@/types/memory'

export default function HomePage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [filtered, setFiltered] = useState<Memory[]>([])
  const [rawText, setRawText] = useState('')
  const [titleText, setTitleText] = useState('')
  const [isDumping, setIsDumping] = useState(false)
  const [isMobileDumpOpen, setIsMobileDumpOpen] = useState(false)

  const [isExpanded, setIsExpanded] = useState(false)

  // Fetch initial data
  useEffect(() => {
    fetch('/api/memory')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setMemories(data)
          setFiltered(data)
        }
      })
      .catch(err => console.error("Gagal load data", err))
  }, [])

  const handleDump = async () => {
    if (!rawText.trim()) return
    setIsDumping(true)
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, title: titleText })
      })
      const newMemory = await res.json()
      if (newMemory && newMemory.id) {
        setMemories(prev => [newMemory, ...prev])
        setFiltered(prev => [newMemory, ...prev])
        setRawText('')
        setTitleText('')
        setIsExpanded(false)
        setIsMobileDumpOpen(false)
      } else {
        alert("Gagal dump: " + JSON.stringify(newMemory))
      }
    } catch (e) {
      alert("Error: " + e)
    } finally {
      setIsDumping(false)
    }
  }

  return (
    <main className="h-screen w-full flex flex-col bg-[#05050A] overflow-hidden relative">
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Full-Screen Brain Canvas Background + Ambient Light Orbs */}
      <div className="absolute inset-0 z-0 pt-14 pointer-events-auto">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-[140px] pointer-events-none" />
        <BrainCanvas memories={filtered} />
      </div>

      {/* Floating UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none pt-20 md:pt-24 px-4 md:px-6 pb-6 pb-safe flex flex-col justify-between">
        
        {/* Top Floating Section (Header & Search Bar) */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 pointer-events-none max-w-7xl mx-auto w-full">
          {/* Header Island */}
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="p-5 rounded-3xl pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.01] hover:border-white/[0.14]"
            style={{
              background: 'rgba(13, 15, 26, 0.65)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 12px 40px -10px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
            }}
          >
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white mb-1 tracking-tight">
              Memory <span className="text-indigo-400 font-light">Galaxy</span>
            </h1>
            <p className="text-slate-400 text-xs">
              {memories.length} memori tersimpan · Jelajahi klaster ide & transkrip
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="w-full md:w-80 pointer-events-auto"
          >
            <SearchBar memories={memories} onFilter={setFiltered} />
            {filtered.length === 0 && (
              <div className="mt-2 text-center py-2.5 bg-black/60 backdrop-blur-md rounded-xl text-slate-400 text-xs border border-white/10 shadow-lg">
                Tidak ada memori yang cocok.
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Floating Section (Command Dock & KPI Cards) */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-3 pointer-events-none max-w-4xl mx-auto w-full"
        >
          {/* Desktop & Tablet Sleek Floating Prompt Capsule */}
          <div className="hidden md:block w-full pointer-events-auto">
            <div
              className="p-3.5 sm:p-4 rounded-[26px] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/[0.14] group"
              style={{
                background: 'rgba(13, 15, 26, 0.8)',
                backdropFilter: 'blur(36px)',
                WebkitBackdropFilter: 'blur(36px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.8), 0 1px 0 rgba(255, 255, 255, 0.12) inset',
              }}
            >
              <div className="flex items-center justify-between gap-3 mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs shadow-[0_0_12px_rgba(99,102,241,0.3)]">⚡</span>
                  <span className="text-white text-xs font-semibold tracking-tight">AI Quick Dump Prompt</span>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer px-2.5 py-1 rounded-full hover:bg-white/[0.06] border border-transparent hover:border-white/10"
                >
                  {isExpanded ? 'Sederhanakan ✕' : 'Tulis Judul Manual +'}
                </button>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden mb-2"
                  >
                    <input
                      type="text"
                      value={titleText}
                      onChange={(e) => setTitleText(e.target.value)}
                      placeholder="Judul Catatan (opsional)"
                      className="w-full bg-black/40 text-base md:text-sm text-slate-100 p-3 rounded-2xl border border-white/10 focus:outline-none focus:border-indigo-500/80 focus:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all placeholder:text-slate-500"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2.5 items-center">
                <textarea 
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste obrolan / ide panjang di sini... AI akan otomatis merangkum & menata."
                  className="flex-1 h-13 bg-black/40 text-base md:text-sm text-slate-100 px-4 py-3 rounded-2xl border border-white/10 focus:outline-none focus:border-indigo-500/80 focus:shadow-[0_0_24px_rgba(99,102,241,0.3)] resize-none transition-all placeholder:text-slate-500 custom-scrollbar leading-snug"
                />
                <button 
                  onClick={handleDump}
                  disabled={isDumping || !rawText.trim()}
                  className="h-13 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shadow-[0_0_24px_rgba(99,102,241,0.4)] hover:shadow-[0_0_32px_rgba(99,102,241,0.6)] hover:scale-105 active:scale-95 shrink-0 border border-indigo-400/30"
                >
                  {isDumping ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Ekstrak...</span>
                    </span>
                  ) : (
                    <span>Dump ke Galaksi ⚡</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Control Row */}
          <div className="flex items-center justify-between w-full gap-3 pointer-events-auto">
            {/* Mobile Quick Dump Trigger Button */}
            <button
              onClick={() => setIsMobileDumpOpen(true)}
              className="md:hidden flex-1 py-3.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-full shadow-[0_0_24px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 border border-indigo-400/30 cursor-pointer"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs">⚡</span>
              <span>Quick Dump AI</span>
            </button>

            {/* KPI Cards (Compact & weightless pill badges) */}
            <div
              className="rounded-full px-3 py-1.5 flex items-center gap-2 ml-auto shadow-lg backdrop-blur-2xl shrink-0 transition-all duration-300 hover:border-white/[0.14]"
              style={{
                background: 'rgba(13, 15, 26, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
              }}
            >
              {[
                { label: 'Memori', value: memories.length },
                { label: 'Tag', value: [...new Set(memories.flatMap(m => m.tags || []))].length },
                { label: 'Hari', value: new Set(memories.map(m => m.created_at ? new Date(m.created_at).toISOString().slice(0, 10) : '')).size },
              ].map(({ label, value }, i) => (
                <div key={label} className={`px-2.5 py-0.5 text-center flex items-center gap-1.5 ${i > 0 ? 'border-l border-white/10 pl-3' : ''}`}>
                  <span className="text-xs font-extrabold text-white">{value}</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>

      {/* Mobile Quick Dump Modal (iOS Anti-Zoom & Safe Areas) */}
      <AnimatePresence>
        {isMobileDumpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md pointer-events-auto"
            onClick={() => setIsMobileDumpOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="glass rounded-t-3xl sm:rounded-3xl p-6 pb-8 pb-safe w-full max-w-lg border-t sm:border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              style={{ background: 'rgba(11, 14, 28, 0.98)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-4 sm:hidden" />
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">⚡</span>
                  <h2 className="text-white text-base font-semibold">Quick Dump AI</h2>
                </div>
                <button
                  onClick={() => setIsMobileDumpOpen(false)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  aria-label="Tutup modal"
                >
                  ✕
                </button>
              </div>
              <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                Isi judul sendiri (opsional) atau biarkan kosong agar AI merangkum otomatis dari obrolan di bawah.
              </p>
              <input
                type="text"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                placeholder="Judul Catatan (opsional)"
                className="w-full bg-black/50 text-base sm:text-sm text-slate-100 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 mb-3 placeholder:text-slate-500"
              />
              <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste transkrip obrolan / teks panjang di sini..."
                className="w-full h-36 bg-black/50 text-base sm:text-sm text-slate-100 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 resize-none mb-4 custom-scrollbar placeholder:text-slate-500"
              />
              <button 
                onClick={handleDump}
                disabled={isDumping || !rawText.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                {isDumping ? 'Mengekstrak AI...' : 'Simpan & Dump ke Galaksi'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
