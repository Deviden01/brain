'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { Memory } from '@/types/memory'
import { getTagColor } from '@/lib/tagColors'
import MemoryCard from './MemoryCard'

function formatDate(iso: string | Date) {
  const d = new Date(iso)
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return {
    day: days[d.getDay()],
    dateNum: d.getDate(),
    month: months[d.getMonth()],
    year: d.getFullYear(),
  }
}

export default function TimelineItem({ memory, index }: { memory: Memory; index: number }) {
  const [selected, setSelected] = useState(false)
  const { day, dateNum, month } = formatDate(memory.created_at)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
        className="flex gap-4 sm:gap-6 group relative"
      >
        {/* ── Left: date column + glowing node dot + connector line ── */}
        <div className="flex flex-col items-center shrink-0 w-14 sm:w-16">
          <div
            className="w-full rounded-2xl flex flex-col items-center py-2.5 px-1 select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:border-indigo-500/40 shadow-md"
            style={{
              background: 'rgba(13, 15, 26, 0.75)',
              border: '1px solid rgba(99,102,241,0.28)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.1) inset',
            }}
          >
            <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider leading-none">
              {day}
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-white leading-tight mt-1">
              {dateNum}
            </span>
            <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider leading-none mt-0.5">
              {month}
            </span>
          </div>
          {/* Spine dot & vertical line */}
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_12px_#6366f1] my-2 group-hover:scale-125 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
          <div
            className="flex-1 w-0.5 min-h-[20px] rounded-full"
            style={{ background: 'linear-gradient(180deg, rgba(99,102,241,0.4) 0%, rgba(255,255,255,0.05) 100%)' }}
          />
        </div>

        {/* ── Right: content card ── */}
        <article
          className="flex-1 mb-5 rounded-[22px] cursor-pointer overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:border-indigo-500/50 relative"
          style={{
            background: 'rgba(13, 15, 26, 0.65)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 12px 36px -10px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.12) inset',
          }}
          onClick={() => setSelected(true)}
        >
          <div
            className="absolute left-0 inset-y-0 w-1 bg-indigo-500 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_16px_#6366f1]"
          />

          <div className="p-5 sm:p-6 relative">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {(memory.tags || []).map(tag => {
                const c = getTagColor(tag)
                return (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-lg font-semibold tracking-tight transition-transform hover:scale-105"
                    style={{
                      background: c + '18',
                      color: c,
                      border: `1px solid ${c}30`,
                    }}
                  >
                    #{tag}
                  </span>
                )
              })}
            </div>

            <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-snug mb-2 group-hover:text-indigo-200 transition-colors">
              {memory.title}
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-2 mb-4 font-normal">
              {memory.summary}
            </p>

            <Link 
              href={`/memory/${memory.id}`}
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/[0.06] hover:bg-indigo-600/80 px-4 py-2 min-h-[38px] rounded-xl border border-white/10 shadow-sm active:scale-95"
            >
              <span>Lihat Teks Asli & Detail</span>
              <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
                <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </article>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <MemoryCard
            memory={memory}
            onClose={() => setSelected(false)}
            onDelete={(id) => { console.log('delete', id); setSelected(false) }}
            onEdit={(m) => { console.log('edit', m.id); setSelected(false) }}
          />
        )}
      </AnimatePresence>
    </>
  )
}
