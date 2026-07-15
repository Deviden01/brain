'use client'

import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import Navbar from '@/components/Navbar'
import TimelineItem from '@/components/TimelineItem'
import SearchBar from '@/components/SearchBar'
import { mockMemories } from '@/lib/mockData'
import { Memory } from '@/types/memory'
import { getTagColor } from '@/lib/tagColors'

export default function DashboardPage() {
  const [filtered, setFiltered] = useState<Memory[]>(mockMemories)

  // Calculate some fun dashboard stats
  const uniqueTags = useMemo(() => {
    const tags = mockMemories.flatMap(m => m.tags)
    const counts = tags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }, [])

  return (
    <main className="min-h-screen bg-[#05050A] pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-28 px-6 lg:px-8 flex flex-col gap-8">
        
        {/* ── 1. Top Header & CTA ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display text-4xl font-light text-white mb-2">
              Dashboard
            </h1>
            <p className="text-slate-500 text-sm">
              Overview aktivitas Second Brain lu hari ini.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tambah Memori
          </motion.button>
        </div>

        {/* ── 2. KPI Cards Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Memori', value: mockMemories.length, icon: '📦' },
            { label: 'Kategori Aktif', value: uniqueTags.length, icon: '🏷️' },
            { label: 'Catatan Minggu Ini', value: '+12', icon: '📈' },
            { label: 'Rata-rata Panjang', value: '142 kata', icon: '✍️' },
          ].map((kpi, i) => (
            <div key={i} className="glass p-5 rounded-2xl border border-white/[0.04]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-xs font-semibold tracking-wide uppercase">{kpi.label}</span>
                <span className="text-lg grayscale opacity-70">{kpi.icon}</span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{kpi.value}</p>
            </div>
          ))}
        </motion.div>

        {/* ── 3. Main Split View ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
          
          {/* Main Feed (Left Column) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2 glass rounded-3xl p-1 border border-white/[0.05]"
          >
            <div className="bg-black/20 rounded-[22px] p-6 h-full min-h-[500px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h2 className="text-lg font-semibold text-white">Aktivitas Terbaru</h2>
                <div className="w-full sm:w-64">
                  <SearchBar memories={mockMemories} onFilter={setFiltered} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                {filtered.length > 0 ? (
                  filtered.map((memory, i) => (
                    <TimelineItem key={memory.id} memory={memory} index={i} />
                  ))
                ) : (
                  <div className="text-center py-16 text-slate-500 text-sm">
                    Tidak ada memori yang cocok dengan pencarian.
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Widgets (Right Column) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            {/* Widget 1: Top Categories */}
            <div className="glass rounded-3xl p-6 border border-white/[0.04]">
              <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wider text-slate-300">
                Top Kategori
              </h3>
              <div className="flex flex-col gap-4">
                {uniqueTags.slice(0, 6).map(([tag, count], i) => {
                  const max = uniqueTags[0][1]
                  const pct = Math.round((count / max) * 100)
                  const color = getTagColor(tag)
                  
                  return (
                    <div key={tag} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-300">{tag}</span>
                        <span className="text-slate-500">{count} item</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Widget 2: Quick Tips */}
            <div className="glass rounded-3xl p-6 border border-indigo-500/20 bg-indigo-500/5">
              <h3 className="text-sm font-semibold text-indigo-400 mb-3">
                💡 Second Brain Tip
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Menghubungkan catatan (linking) jauh lebih penting daripada mengkategorikan (tagging). Coba gabungkan ide dari tag <span className="text-emerald-400 font-medium">#{uniqueTags[1]?.[0] || 'work'}</span> dengan <span className="text-amber-400 font-medium">#{uniqueTags[2]?.[0] || 'idea'}</span> untuk mendapatkan insight baru.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  )
}
