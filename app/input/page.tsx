'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function InputPage() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    // Phase 3: akan di-connect ke Gemini API + Supabase
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    alert('Fitur simpan akan aktif setelah backend terhubung (Phase 2-3)')
    setText('')
    router.push('/')
  }

  const charCount = text.length

  return (
    <main className="min-h-screen px-4 pb-16 flex flex-col">
      <Navbar />

      <div className="max-w-lg mx-auto w-full pt-24 flex flex-col gap-6 flex-1">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-3xl font-light text-white mb-1">
            Quick Dump
          </h1>
          <p className="text-slate-500 text-sm">
            Tulis apapun — ngalur ngidul, copas artikel, ide random
          </p>
        </motion.div>

        {/* Text area */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Gue lagi mikirin sesuatu..."
            autoFocus
            className="w-full h-64 glass rounded-2xl p-5 text-slate-200 placeholder-slate-600 text-sm leading-relaxed outline-none resize-none focus:border-indigo-500/40 transition-all duration-200"
            style={{ border: '1px solid var(--border)' }}
          />
          <div className="flex justify-between mt-2 px-1">
            <p className="text-slate-600 text-xs">
              AI akan otomatis buat judul, ringkasan, dan tag
            </p>
            <p className={`text-xs ${charCount > 50 ? 'text-indigo-400' : 'text-slate-600'}`}>
              {charCount} karakter
            </p>
          </div>
        </motion.div>

        {/* Voice-to-text placeholder (v2) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-3 flex items-center gap-3 opacity-50 cursor-not-allowed"
        >
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="4" y="1" width="6" height="8" rx="3" stroke="#94a3b8" strokeWidth="1.5"/>
              <path d="M2 7c0 2.8 2.2 5 5 5s5-2.2 5-5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="7" y1="12" x2="7" y2="13.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Voice-to-text</p>
            <p className="text-slate-600 text-xs">Segera hadir di versi 2</p>
          </div>
          <span className="ml-auto text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">v2</span>
        </motion.div>

        {/* Submit button */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-semibold text-white text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            boxShadow: text.trim() ? '0 0 24px rgba(99,102,241,0.35)' : 'none',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                <path d="M8 2a6 6 0 016 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              AI sedang memproses...
            </span>
          ) : (
            'Simpan Ide'
          )}
        </motion.button>
      </div>
    </main>
  )
}
