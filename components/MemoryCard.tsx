'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Memory } from '@/types/memory'
import { getTagColor } from '@/lib/tagColors'

interface MemoryCardProps {
  memory: Memory
  onClose: () => void
  onDelete?: (id: string) => void
  onEdit?: (memory: Memory) => void
}

function formatDate(iso: string | Date) {
  const d = new Date(iso)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return {
    day: days[d.getDay()],
    date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
    time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  }
}

export default function MemoryCard({ memory, onClose, onDelete, onEdit }: MemoryCardProps) {
  const [showFull, setShowFull] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { day, date, time } = formatDate(memory.created_at)

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,8,0.72)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        key="card"
        initial={{ opacity: 0, y: 56 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 56 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[480px] md:w-full"
      >
        <div
          className="rounded-t-[28px] md:rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: 'rgba(11, 11, 34, 0.95)',
            backdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}
        >
          {/* Drag handle mobile */}
          <div className="pt-3 pb-1 flex justify-center md:hidden">
            <div className="w-9 h-1 rounded-full bg-white/15" />
          </div>

          {/* ── Header ── */}
          <div className="px-6 pt-4 pb-0">
            {/* Date row */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold"
                style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}
              >
                {day}
              </span>
              <span className="text-xs text-slate-500 font-medium">{date}</span>
              <span className="text-slate-700 text-xs">·</span>
              <span className="text-xs text-slate-500">{time}</span>
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Title */}
            <h2 className="font-display text-[22px] font-semibold text-white leading-tight mb-4">
              {memory.title}
            </h2>
          </div>

          {/* ── Divider ── */}
          <div className="mx-6 h-px bg-white/6 mb-4" />

          {/* ── Body ── */}
          <div className="px-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(memory.tags || []).map(tag => {
                const c = getTagColor(tag)
                return (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{
                      background: c + '1e',
                      color: c,
                      border: `1px solid ${c}38`,
                    }}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>

            {/* Summary — left border accent */}
            <div
              className="pl-3 mb-4"
              style={{ borderLeft: '2px solid rgba(99,102,241,0.35)' }}
            >
              <p className="text-slate-300 text-sm leading-[1.7]">
                {memory.summary}
              </p>
            </div>

            {/* Expand toggle */}
            <button
              onClick={() => setShowFull(v => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors mb-1"
            >
              <motion.span
                animate={{ rotate: showFull ? 180 : 0 }}
                transition={{ duration: 0.18 }}
                className="inline-flex"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.span>
              {showFull ? 'Sembunyikan teks asli' : 'Lihat teks asli'}
            </button>

            <AnimatePresence>
              {showFull && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="mt-2 mb-4 p-4 rounded-xl"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <p className="text-slate-500 text-xs leading-relaxed whitespace-pre-wrap font-mono tracking-tight">
                      {memory.content || memory.raw_text || ''}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Actions ── */}
          <div
            className="px-6 pb-6 pt-3 flex gap-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {onEdit && (
              <button
                onClick={() => onEdit(memory)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[.98]"
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99,102,241,0.28)',
                }}
              >
                Edit
              </button>
            )}

            {onDelete && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[.98]"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239,68,68,0.18)',
                }}
              >
                Hapus
              </button>
            )}

            {confirmDelete && (
              <div className="flex-1 flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
                >
                  Batal
                </button>
                <button
                  onClick={() => onDelete?.(memory.id)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[.98]"
                  style={{ background: '#dc2626' }}
                >
                  Ya, Hapus
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
