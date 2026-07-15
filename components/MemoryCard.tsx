'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  const [activeTab, setActiveTab] = useState<'summary' | 'chat'>('summary')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit Mode states
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editTitle, setEditTitle] = useState(memory.title)
  const [editSummary, setEditSummary] = useState(memory.summary)
  const [editContent, setEditContent] = useState(memory.content || memory.raw_text || '')
  const [editTags, setEditTags] = useState((memory.tags || []).join(', '))

  const { day, date, time } = formatDate(memory.created_at)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/memory/${memory.id}`, { method: 'DELETE' })
      if (res.ok) {
        if (onDelete) onDelete(memory.id)
        onClose()
        window.location.reload()
      } else {
        const err = await res.json().catch(() => ({}))
        alert('Gagal menghapus: ' + (err.error || res.statusText))
      }
    } catch (e: any) {
      alert('Error: ' + e.message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveEdit = async () => {
    setIsSaving(true)
    try {
      const tagsArray = editTags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)

      const res = await fetch(`/api/memory/${memory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          summary: editSummary,
          content: editContent,
          tags: tagsArray,
        }),
      })

      if (res.ok) {
        const updated = await res.json()
        if (onEdit) onEdit(updated)
        setIsEditing(false)
        window.location.reload()
      } else {
        const err = await res.json().catch(() => ({}))
        alert('Gagal menyimpan: ' + (err.error || res.statusText))
      }
    } catch (e: any) {
      alert('Error: ' + e.message)
    } finally {
      setIsSaving(false)
    }
  }

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
        style={{ background: 'rgba(0,0,8,0.85)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
      />

      {/* Card */}
      <motion.div
        key="card"
        initial={{ opacity: 0, y: 56 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 56 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[520px] md:w-full"
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
              <span className="text-xs text-slate-400 font-medium">{date}</span>
              <span className="text-slate-600 text-xs">·</span>
              <span className="text-xs text-slate-400">{time}</span>
              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="ml-auto w-11 h-11 -mr-2 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 13 13" fill="none">
                  <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Title */}
            {!isEditing ? (
              <h2 className="font-display text-[22px] font-semibold text-white leading-tight mb-4">
                {memory.title}
              </h2>
            ) : (
              <div className="mb-4">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block mb-1">✏️ Mode Edit</span>
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div className="mx-6 h-px bg-white/6 mb-4" />

          {/* ── Body ── */}
          {isEditing ? (
            <div className="px-6 pb-2 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Judul Catatan</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ringkasan AI</label>
                <textarea
                  rows={3}
                  value={editSummary}
                  onChange={e => setEditSummary(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm leading-relaxed focus:outline-none focus:border-indigo-500 custom-scrollbar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Percakapan / Transkrip</label>
                <textarea
                  rows={6}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm leading-relaxed font-sans focus:outline-none focus:border-indigo-500 custom-scrollbar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tags (pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                  placeholder="ai, ide, project"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          ) : (
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

              {/* Mode Tab Switcher */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex p-1 rounded-xl bg-black/40 border border-white/10 w-full">
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'summary'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>✨</span>
                    <span>Ringkasan AI</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'chat'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>💬</span>
                    <span>Full Percakapan</span>
                  </button>
                </div>
              </div>

              {/* Tab Contents */}
              <div className="mb-4">
                {activeTab === 'summary' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pl-3 py-1"
                    style={{ borderLeft: '2px solid rgba(99,102,241,0.5)' }}
                  >
                    <p className="text-slate-200 text-sm leading-[1.7]">
                      {memory.summary}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl max-h-64 overflow-y-auto custom-scrollbar bg-black/30 border border-white/10"
                  >
                    {(memory.content || memory.raw_text || '')
                      .split('\n')
                      .filter(Boolean)
                      .map((para: string, idx: number) => (
                        <p key={idx} className="text-slate-300 text-xs md:text-sm leading-relaxed mb-3 font-sans last:mb-0">
                          {para}
                        </p>
                      ))}
                  </motion.div>
                )}
              </div>

              <div className="flex justify-end mb-2">
                <Link
                  href={`/memory/${memory.id}`}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 flex items-center gap-1"
                >
                  <span>Buka di Halaman Penuh</span>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          <div
            className="px-6 pb-6 pt-4 flex gap-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-colors bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 active:scale-[.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
              </>
            ) : !confirmDelete ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[.98]"
                  style={{
                    background: 'rgba(99,102,241,0.15)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99,102,241,0.28)',
                  }}
                >
                  Edit
                </button>
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
              </>
            ) : (
              <div className="flex-1 flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-colors disabled:opacity-50"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.09)' }}
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: '#dc2626' }}
                >
                  {isDeleting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    'Ya, Hapus'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
