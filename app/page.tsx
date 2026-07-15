'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import Navbar from '@/components/Navbar'
import BrainCanvas from '@/components/BrainCanvas'
import SearchBar from '@/components/SearchBar'
import { Memory } from '@/types/memory'

export default function HomePage() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [filtered, setFiltered] = useState<Memory[]>([])
  const [rawText, setRawText] = useState('')
  const [isDumping, setIsDumping] = useState(false)

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
        body: JSON.stringify({ rawText })
      })
      const newMemory = await res.json()
      if (newMemory && newMemory.id) {
        // Add new memory to the front of the list
        setMemories(prev => [newMemory, ...prev])
        setFiltered(prev => [newMemory, ...prev])
        setRawText('')
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
      <div className="absolute inset-0 z-10 pointer-events-none pt-24 px-6 pb-6 flex flex-col justify-between">
        
        {/* Top Floating Section (Header & Search) */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 pointer-events-auto">
          {/* Left Column: Header & Quick Dump */}
          <div className="flex flex-col gap-4 pointer-events-auto w-full md:w-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="glass p-5 rounded-3xl md:w-80"
            >
              <h1 className="font-display text-3xl font-light text-white mb-1 tracking-tight">
                Memory
              </h1>
              <p className="text-slate-400 text-xs">
                {memories.length} memori tersimpan · Jelajahi galaxy ide
              </p>
            </motion.div>

            {/* Quick Dump Widget */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="glass p-5 rounded-3xl md:w-80"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">⚡</span>
                <h2 className="text-white text-sm font-semibold">Quick Dump</h2>
              </div>
              <p className="text-slate-400 text-[10px] mb-4 leading-relaxed">
                <strong>Cara pakai:</strong> Copy percakapan dari Claude, ChatGPT, atau web manapun. Paste ke bawah, dan sistem kita bakal otomatis mengekstrak intisarinya jadi gelembung 3D baru.
              </p>
              <textarea 
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste teks panjang di sini..."
                className="w-full h-24 bg-black/40 text-xs text-slate-200 p-3 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500/50 resize-none transition-colors placeholder:text-slate-600 mb-2"
                style={{ backdropFilter: 'blur(10px)' }}
              />
              <button 
                onClick={handleDump}
                disabled={isDumping}
                className="w-full py-2.5 bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 text-white text-xs font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="w-full md:w-96"
          >
            <SearchBar memories={memories} onFilter={setFiltered} />
            
            {filtered.length === 0 && (
              <div className="mt-3 text-center py-3 bg-black/40 backdrop-blur-md rounded-xl text-slate-400 text-xs border border-white/5">
                Tidak ada memori yang cocok.
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Floating Section (Stats) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center md:justify-end pointer-events-auto"
        >
          <div className="glass rounded-2xl p-2 flex gap-2">
            {[
              { label: 'Memori', value: memories.length },
              { label: 'Tag Unik', value: [...new Set(memories.flatMap(m => m.tags))].length },
              { label: 'Hari Aktif', value: new Set(memories.map(m => m.created_at?.slice(0, 10))).size },
            ].map(({ label, value }) => (
              <div key={label} className="px-5 py-2 text-center rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors border border-white/[0.02]">
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  )
}
