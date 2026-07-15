'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface MemoryDetailTabsProps {
  summary: string
  content: string
}

export default function MemoryDetailTabs({ summary, content }: MemoryDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'chat'>('summary')

  const paragraphs = (content || '')
    .split('\n')
    .filter(Boolean)

  return (
    <div className="relative z-10">
      {/* ── Segmented Tab Switcher ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-black/40 p-1.5 rounded-2xl border border-white/10">
        <div className="flex w-full gap-1">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-3 px-5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>✨</span>
            <span>Ringkasan AI</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 px-5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>💬</span>
            <span>Full Obrolan & Teks Asli</span>
          </button>
        </div>
      </div>

      {/* ── Tab Content Area ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'summary' ? (
          <motion.div
            key="summary-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-indigo-500/[0.06] rounded-2xl p-6 md:p-8 border border-indigo-500/20 shadow-inner"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">✨</span>
              <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">
                Intisari & Poin Penting (Disusun AI)
              </h3>
            </div>
            <p className="text-indigo-100/90 text-base md:text-lg leading-[1.8] font-sans">
              {summary || 'Ringkasan tidak tersedia.'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="chat-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-black/40 rounded-2xl p-6 md:p-8 border border-white/10 shadow-inner"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-slate-300 text-xs">📄</span>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
                  Transkrip / Hasil Copas Lengkap
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                {paragraphs.length} Paragraf
              </span>
            </div>

            {paragraphs.length > 0 ? (
              <div className="space-y-4">
                {paragraphs.map((para: string, idx: number) => (
                  <p
                    key={idx}
                    className="text-slate-200 text-sm md:text-base leading-[1.8] font-sans"
                  >
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm italic py-8 text-center">
                Teks obrolan kosong atau tidak tersedia.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
