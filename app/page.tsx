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

      {/* Full-Screen Brain Canvas Background */}
      <div className="absolute inset-0 z-0 pt-14">
        <BrainCanvas memories={filtered} />
      </div>

      {/* Floating UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none pt-20 md:pt-24 px-4 md:px-6 pb-6 pb-safe flex flex-col justify-between">
        
        {/* Top Floating Section (Header & Search Bar) */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 pointer-events-none max-w-7xl mx-auto w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass p-5 rounded-3xl pointer-events-auto border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          >
            <h1 className="font-display text-2xl md:text-3xl font-light text-white mb-1 tracking-tight">
              Memory <span className="text-indigo-400 font-normal">Galaxy</span>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center gap-3 pointer-events-none max-w-4xl mx-auto w-full"
        >
          {/* Desktop & Tablet Sleek AI Command Dock */}
          <div className="hidden md:block w-full pointer-events-auto">
            <div className="glass p-4 rounded-3xl border border-white/10 shadow-[0_12px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">⚡</span>
                  <span className="text-white text-xs font-semibold">AI Quick Dump Dock</span>
                </div>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-white/5"
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
                    className="overflow-hidden mb-2"
                  >
                    <input
                      type="text"
                      value={titleText}
                      onChange={(e) => setTitleText(e.target.value)}
                      placeholder="Judul Catatan (opsional)"
                      className="w-full bg-black/50 text-base md:text-sm text-slate-100 p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-2">
                <textarea 
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste transkrip obrolan / ide panjang di sini... AI akan merangkum otomatis."
                  className="flex-1 h-14 bg-black/50 text-base md:text-sm text-slate-100 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500 resize-none transition-colors placeholder:text-slate-500 custom-scrollbar"
                />
                <button 
                  onClick={handleDump}
                  disabled={isDumping || !rawText.trim()}
                  className="px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shadow-lg shadow-indigo-500/20 active:scale-95 shrink-0"
                >
                  {isDumping ? 'Mengekstrak...' : 'Dump ke Galaksi'}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Control Row */}
          <div className="flex items-center justify-between w-full gap-3 pointer-events-auto">
            {/* Mobile Quick Dump Trigger Button */}
            <button
              onClick={() => setIsMobileDumpOpen(true)}
              className="md:hidden flex-1 py-3 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-2xl shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs">⚡</span>
              <span>Quick Dump AI</span>
            </button>

            {/* KPI Cards (Compact & sleek on both desktop and mobile) */}
            <div className="glass rounded-2xl p-1.5 flex gap-1.5 border border-white/10 ml-auto shadow-lg backdrop-blur-xl shrink-0">
              {[
                { label: 'Memori', value: memories.length },
                { label: 'Tag Unik', value: [...new Set(memories.flatMap(m => m.tags || []))].length },
                { label: 'Hari Aktif', value: new Set(memories.map(m => m.created_at ? new Date(m.created_at).toISOString().slice(0, 10) : '')).size },
              ].map(({ label, value }) => (
                <div key={label} className="px-3 py-1 text-center rounded-xl bg-white/[0.03] border border-white/[0.03] min-w-[56px]">
                  <p className="text-sm font-bold text-white">{value}</p>
                  <p className="text-[8px] text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
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
