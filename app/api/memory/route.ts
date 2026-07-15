import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const { rawText, title: customTitle } = await req.json()
    if (!rawText) return NextResponse.json({ error: 'No rawText provided' }, { status: 400 })

    let parsedResult: { title: string; summary: string; tags: string[] }

    // Check if API key exists. If yes, use AI to generate accurate title, summary & tags.
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      try {
        const { object } = await generateObject({
          model: google('gemini-1.5-flash'), 
          schema: z.object({
            title: z.string().describe('Judul singkat max 7 kata yang sangat akurat mencerminkan isi obrolan'),
            summary: z.string().describe('Ringkasan eksekutif 2-4 kalimat yang SANGAT JELAS, padat, dan nyambung, merangkum masalah utama, solusi, dan poin penting dari obrolan.'),
            tags: z.array(z.string()).describe('Max 4 tag relevan dan spesifik dalam huruf kecil semua'),
          }),
          prompt: `Kamu adalah AI analis cerdas. Tugasmu membuat judul yang tepat (jika belum disediakan user), ringkasan yang SANGAT NYAMBUNG dan akurat, serta tag relevan dari transkrip percakapan berikut.\n\n${
            customTitle?.trim() ? `JUDUL DARI USER: "${customTitle.trim()}"\n(Gunakan judul dari user ini atau rapikan sedikit agar sempurna sebagai judul utama)\n\n` : ''
          }TEKS PERCAKAPAN/TRANSKRIP UTUH:\n\n${rawText}\n\nIngat: Buat ringkasan yang benar-benar nyambung dan menjelaskan intisari dari obrolan di atas.`,
        });
        parsedResult = object;
      } catch (aiError) {
        console.error("AI SDK Error:", aiError)
        // Fallback on AI error
        parsedResult = {
          title: customTitle?.trim() ? customTitle.trim() : (rawText.substring(0, 35) + (rawText.length > 35 ? '...' : '')),
          summary: "AI tidak dapat memproses ringkasan saat ini. Berikut transkrip lengkapnya.",
          tags: ["quick-dump", "raw"],
        }
      }
    } else {
      // Fallback if no API key is provided
      parsedResult = {
        title: customTitle?.trim() ? customTitle.trim() : (rawText.substring(0, 35) + (rawText.length > 35 ? '...' : '')),
        summary: rawText.substring(0, 150) + (rawText.length > 150 ? '...' : ''),
        tags: ['quick-dump', 'raw'],
      }
    }

    const memory = await prisma.memory.create({
      data: {
        title: customTitle?.trim() ? customTitle.trim() : (parsedResult.title || 'Catatan Tanpa Judul'),
        summary: parsedResult.summary,
        tags: parsedResult.tags,
        content: rawText, // Selalu utuh 100% tanpa dipotong atau diubah
      }
    })

    return NextResponse.json(memory)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  const memories = await prisma.memory.findMany({
    orderBy: { created_at: 'desc' }
  })
  
  return NextResponse.json(memories)
}
