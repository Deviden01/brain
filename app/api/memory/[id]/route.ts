import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.memory.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Error deleting memory:', e)
    return NextResponse.json({ error: e.message || 'Failed to delete memory' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params)
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { title, summary, content, tags } = await req.json()

    const updatedMemory = await prisma.memory.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        summary: summary !== undefined ? summary : undefined,
        content: content !== undefined ? content : undefined,
        tags: Array.isArray(tags) ? tags : undefined,
      },
    })

    return NextResponse.json(updatedMemory)
  } catch (e: any) {
    console.error('Error updating memory:', e)
    return NextResponse.json({ error: e.message || 'Failed to update memory' }, { status: 500 })
  }
}
