import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json()
    if (!rawText) return NextResponse.json({ error: 'No rawText provided' }, { status: 400 })

    let parsedResult;

    // Check if API key exists. If yes, use AI. If no, use fallback parsing logic.
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      try {
        const { object } = await generateObject({
          model: google('gemini-1.5-flash'), 
          schema: z.object({
            title: z.string().describe('Judul singkat max 5 kata'),
            summary: z.string().describe('Ringkasan padat 1-2 kalimat'),
            tags: z.array(z.string()).describe('Max 3 tag relevan, huruf kecil semua'),
            content: z.string().describe('Rapikan teks mentah ini jadi catatan komprehensif berformat markdown'),
          }),
          prompt: `Buatkan struktur data memori dari teks mentah berikut:\n\n${rawText}`,
        });
        parsedResult = object;
      } catch (aiError) {
        console.error("AI SDK Error:", aiError)
        // Fallback on AI error
        parsedResult = {
          title: "AI Parse Error",
          summary: "Gagal ngekstrak pakai AI.",
          tags: ["error"],
          content: rawText,
        }
      }
    } else {
      // Fallback if no API key is provided
      parsedResult = {
        title: rawText.substring(0, 20) + (rawText.length > 20 ? '...' : ''),
        summary: rawText.substring(0, 100) + (rawText.length > 100 ? '...' : ''),
        tags: ['quick-dump', 'raw'],
        content: rawText,
      }
    }

    const memory = await prisma.memory.create({
      data: {
        title: parsedResult.title,
        summary: parsedResult.summary,
        tags: parsedResult.tags, // Native Postgres Array
        content: parsedResult.content,
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
