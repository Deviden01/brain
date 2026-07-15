import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import MemoryDetailTabs from '@/components/MemoryDetailTabs'
import { prisma } from '@/lib/prisma'
import { getTagColor } from '@/lib/tagColors'

export default async function MemoryDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const resolvedParams = await Promise.resolve(params)
  const memory = await prisma.memory.findUnique({
    where: { id: resolvedParams.id }
  })
  
  if (!memory) {
    return notFound()
  }

  // Format date
  const dateObj = new Date(memory.created_at)
  const formattedDate = dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <main className="min-h-screen bg-[#05050A] pb-24">
      <Navbar />

      <div className="max-w-4xl mx-auto pt-32 px-6">
        
        {/* Back Button */}
        <Link 
          href="/timeline" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M8.5 2.5l-4 4.5 4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-medium">Kembali ke Dashboard</span>
        </Link>

        {/* Content Card */}
        <div
          className="rounded-[32px] p-8 md:p-12 transition-all duration-300 relative overflow-hidden"
          style={{
            background: 'rgba(13, 15, 26, 0.75)',
            backdropFilter: 'blur(32px)',
            WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 24px 64px -16px rgba(0,0,0,0.85), 0 1px 0 rgba(255,255,255,0.12) inset',
          }}
        >
          {/* Subtle background glow based on first tag color */}
          {memory.tags.length > 0 && (
            <div 
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none animate-pulse"
              style={{ background: getTagColor(memory.tags[0]) }}
            />
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6 relative z-10">
            {(memory.tags || []).map(tag => {
              const c = getTagColor(tag)
              return (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-lg font-semibold tracking-wide"
                  style={{
                    background: c + '18',
                    color: c,
                    border: `1px solid ${c}28`,
                  }}
                >
                  #{tag}
                </span>
              )
            })}
          </div>

          {/* Title & Meta */}
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 relative z-10 tracking-tight">
            {memory.title}
          </h1>
          <p className="text-slate-500 text-sm mb-10 relative z-10">
            Disimpan pada {formattedDate}
          </p>

          <hr className="border-white/5 mb-8 relative z-10" />

          {/* 2-Mode Tab Switcher (Ringkasan AI & Full Obrolan) */}
          <MemoryDetailTabs 
            summary={memory.summary} 
            content={memory.content || (memory as any).raw_text || ''} 
          />

          {/* Actions */}
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 relative z-10">
            {memory.source_url ? (
              <a 
                href={memory.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group"
              >
                Buka di Sumber Asli
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-0.5 transition-transform">
                  <path d="M6 1h7v7M13 1L5.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            ) : (
              <div className="w-full sm:w-auto px-6 py-3 bg-white/5 text-slate-500 font-semibold rounded-xl border border-white/5 flex items-center justify-center cursor-not-allowed">
                URL Sumber Tidak Tersedia
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
