import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const FlashcardSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  difficulty: z.string().default("medio"),
  caseId: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const due = searchParams.get("due")
  const category = searchParams.get("category")

  const where: Record<string, unknown> = {}
  if (due === "true") where.nextReview = { lte: new Date() }
  if (category) where.category = category

  const cards = await prisma.flashcard.findMany({ where, orderBy: { nextReview: "asc" } })
  return NextResponse.json(cards)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = FlashcardSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { tags, ...rest } = parsed.data
  const created = await prisma.flashcard.create({
    data: { ...rest, tags: JSON.stringify(tags) },
  })
  return NextResponse.json(created, { status: 201 })
}
