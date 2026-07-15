'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function InputPage() {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: text, title })
      })
      const data = await res.json()
      if (res.ok && data.id) {
        setText('')
        setTitle('')
        router.push('/')
      } else {
        alert('Gagal menyimpan catatan: ' + (data.error || 'Unknown error'))
      }
    } catch (e: any) {
      alert('Error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const charCount = text.length

  return (
    <main className="min-h-screen px-4 pb-16 flex flex-col bg-[#05050A]">
      <Navbar />

      <div className="max-w-lg mx-auto w-full pt-24 flex flex-col gap-5 flex-1">

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
            Tulis apapun — ngalur ngidul, copas artikel, transkrip percakapan AI
          </p>
        </motion.div>

        {/* Title Input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Judul Catatan (Opsional)
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Misal: Fix Bug Next.js Vercel (biarkan kosong agar AI buat otomatis)"
            disabled={loading}
            className="w-full px-4 py-3 glass rounded-xl text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-indigo-500/50 transition-all duration-200 border border-white/10 bg-black/40"
          />
        </motion.div>

        {/* Text area */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col"
        >
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Isi Transkrip / Copas Percakapan
          </label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Gue lagi mikirin sesuatu / copas transkrip penuh di sini..."
            autoFocus
            disabled={loading}
            className="w-full h-64 glass rounded-2xl p-5 text-slate-200 placeholder-slate-600 text-sm leading-relaxed outline-none resize-none focus:border-indigo-500/40 transition-all duration-200 border border-white/10 bg-black/40 custom-scrollbar"
          />
          <div className="flex justify-between mt-2 px-1">
            <p className="text-slate-500 text-xs">
              ⚡ AI akan merangkum intisarinya secara nyambung & menjaga transkrip utuh
            </p>
            <p className={`text-xs ${charCount > 50 ? 'text-indigo-400 font-medium' : 'text-slate-600'}`}>
              {charCount} karakter
            </p>
          </div>
        </motion.div>

        {/* Submit button */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-semibold text-white text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed mt-2 cursor-pointer"
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
              AI sedang merangkum & mengekstrak...
            </span>
          ) : (
            'Simpan & Ekstrak AI'
          )}
        </motion.button>
      </div>
    </main>
  )
}
