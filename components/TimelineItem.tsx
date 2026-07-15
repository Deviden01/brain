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
        transition={{ delay: index * 0.055, duration: 0.38, ease: 'easeOut' }}
        className="flex gap-4 group"
      >
        {/* ── Left: date column + connector line ── */}
        <div className="flex flex-col items-center shrink-0 w-12">
          <div
            className="w-12 rounded-xl flex flex-col items-center py-2 select-none"
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          >
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide leading-none">
              {day}
            </span>
            <span className="text-xl font-bold text-white leading-tight mt-0.5">
              {dateNum}
            </span>
            <span className="text-[9px] text-slate-500 uppercase tracking-wide leading-none">
              {month}
            </span>
          </div>
          <div
            className="flex-1 w-px mt-2 min-h-[12px]"
            style={{ background: 'rgba(99,102,241,0.12)' }}
          />
        </div>

        {/* ── Right: content card ── */}
        <article
          className="flex-1 mb-3 rounded-2xl cursor-pointer overflow-hidden transition-all duration-200 group-hover:-translate-y-0.5"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
          }}
          onClick={() => setSelected(true)}
        >
          <div
            className="absolute left-0 inset-y-0 w-0.5 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: 'linear-gradient(180deg, #6366f1, #818cf8)' }}
          />

          <div className="p-5 relative">
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {(memory.tags || []).map(tag => {
                const c = getTagColor(tag)
                return (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-md font-semibold"
                    style={{
                      background: c + '18',
                      color: c,
                      border: `1px solid ${c}28`,
                    }}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>

            <h3 className="font-display text-[17px] font-semibold text-white leading-snug mb-2 group-hover:text-indigo-100 transition-colors">
              {memory.title}
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
              {memory.summary}
            </p>

            <Link 
              href={`/memory/${memory.id}`}
              onClick={e => e.stopPropagation()}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5"
            >
              Lihat Teks Asli & Detail
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
