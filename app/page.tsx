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
        // Add new memory to the front of the list
        setMemories(prev => [newMemory, ...prev])
        setFiltered(prev => [newMemory, ...prev])
        setRawText('')
        setTitleText('')
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
      <div className="absolute inset-0 z-10 pointer-events-none pt-20 md:pt-24 px-4 md:px-6 pb-6 flex flex-col justify-between">
        
        {/* Top Floating Section (Header & Search) */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-3 md:gap-4 pointer-events-none">
          {/* Left Column: Header & Quick Dump */}
          <div className="flex flex-col gap-3 md:gap-4 pointer-events-none w-full md:w-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="glass p-4 md:p-5 rounded-3xl md:w-80 pointer-events-auto"
            >
              <h1 className="font-display text-2xl md:text-3xl font-light text-white mb-1 tracking-tight">
                Memory
              </h1>
              <p className="text-slate-400 text-xs">
                {memories.length} memori tersimpan · Jelajahi galaxy ide
              </p>
            </motion.div>

            {/* Quick Dump Widget (Desktop only inline) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="glass p-5 rounded-3xl md:w-80 pointer-events-auto hidden md:block"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">⚡</span>
                <h2 className="text-white text-sm font-semibold">Quick Dump</h2>
              </div>
              <p className="text-slate-400 text-[10px] mb-3 leading-relaxed">
                <strong>Tips:</strong> Isi judul sendiri atau kosongkan agar AI buat otomatis dari copas di bawah.
              </p>
              <input
                type="text"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                placeholder="Judul (opsional, mis: Fix Bug Next.js)"
                className="w-full bg-black/40 text-xs text-slate-200 p-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-500 mb-2"
                style={{ backdropFilter: 'blur(10px)' }}
              />
              <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste transkrip obrolan di sini..."
                className="w-full h-24 bg-black/40 text-xs text-slate-200 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500/50 resize-none transition-colors placeholder:text-slate-500 mb-2 custom-scrollbar"
                style={{ backdropFilter: 'blur(10px)' }}
              />
              <button 
                onClick={handleDump}
                disabled={isDumping}
                className="w-full py-2.5 bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isDumping ? 'Mengekstrak AI...' : 'Dump ke Galaksi'}
              </button>
            </motion.div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="w-full md:w-96 pointer-events-auto"
          >
            <SearchBar memories={memories} onFilter={setFiltered} />
            
            {filtered.length === 0 && (
              <div className="mt-3 text-center py-3 bg-black/40 backdrop-blur-md rounded-xl text-slate-400 text-xs border border-white/5">
                Tidak ada memori yang cocok.
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Floating Section (Stats & Mobile Quick Dump Button) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-3 pointer-events-none"
        >
          {/* Mobile Quick Dump Trigger Button */}
          <div className="md:hidden w-full flex justify-center pointer-events-auto">
            <button
              onClick={() => setIsMobileDumpOpen(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-full shadow-xl shadow-indigo-500/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-xs">⚡</span>
              <span>Quick Dump AI</span>
            </button>
          </div>

          {/* KPI Cards */}
          <div className="glass rounded-2xl p-2 flex gap-2 pointer-events-auto mx-auto md:mx-0 md:ml-auto">
            {[
              { label: 'Memori', value: memories.length },
              { label: 'Tag Unik', value: [...new Set(memories.flatMap(m => m.tags || []))].length },
              { label: 'Hari Aktif', value: new Set(memories.map(m => m.created_at ? new Date(m.created_at).toISOString().slice(0, 10) : '')).size },
            ].map(({ label, value }) => (
              <div key={label} className="px-3.5 md:px-5 py-1.5 md:py-2 text-center rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/[0.02]">
                <p className="text-base md:text-lg font-bold text-white">{value}</p>
                <p className="text-[9px] md:text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Mobile Quick Dump Modal */}
      <AnimatePresence>
        {isMobileDumpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md pointer-events-auto"
            onClick={() => setIsMobileDumpOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass rounded-3xl p-6 w-full max-w-lg border border-white/10 shadow-2xl relative"
              style={{ background: 'rgba(15, 20, 35, 0.95)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">⚡</span>
                  <h2 className="text-white text-base font-semibold">Quick Dump</h2>
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
                Isi judul sendiri (opsional) atau biarkan kosong agar AI merangkum dan membuatkan judul dari copas di bawah.
              </p>
              <input
                type="text"
                value={titleText}
                onChange={(e) => setTitleText(e.target.value)}
                placeholder="Judul Catatan (opsional)"
                className="w-full bg-black/40 text-xs text-slate-200 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500/50 mb-3"
              />
              <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste transkrip obrolan / teks panjang di sini..."
                className="w-full h-36 bg-black/40 text-xs text-slate-200 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500/50 resize-none mb-4 custom-scrollbar"
              />
              <button 
                onClick={handleDump}
                disabled={isDumping || !rawText.trim()}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
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
