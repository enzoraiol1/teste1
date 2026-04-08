import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const UpdateSchema = z.object({
  title: z.string().min(1).optional(),
  modality: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  difficulty: z.string().optional(),
  findings: z.string().min(1).optional(),
  diagnosis: z.string().min(1).optional(),
  pearls: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  source: z.string().optional(),
  sourceUrl: z.string().optional(),
  reviewed: z.boolean().optional(),
})

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const c = await prisma.case.findUnique({
    where: { id: params.id },
    include: { flashcards: true },
  })
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(c)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const parsed = UpdateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { tags, ...rest } = parsed.data
  const updated = await prisma.case.update({
    where: { id: params.id },
    data: { ...rest, ...(tags !== undefined ? { tags: JSON.stringify(tags) } : {}) },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.case.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
