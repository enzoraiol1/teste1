import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const CaseSchema = z.object({
  title: z.string().min(1),
  modality: z.string().min(1),
  region: z.string().min(1),
  difficulty: z.string().default("medio"),
  findings: z.string().min(1),
  diagnosis: z.string().min(1),
  pearls: z.string().optional(),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
  source: z.string().optional(),
  sourceUrl: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const modality = searchParams.get("modality")
  const region = searchParams.get("region")
  const difficulty = searchParams.get("difficulty")
  const search = searchParams.get("search")

  const where: Record<string, unknown> = {}
  if (modality) where.modality = modality
  if (region) where.region = region
  if (difficulty) where.difficulty = difficulty
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { diagnosis: { contains: search } },
      { findings: { contains: search } },
    ]
  }

  const cases = await prisma.case.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(cases)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = CaseSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { tags, ...rest } = parsed.data
  const created = await prisma.case.create({
    data: { ...rest, tags: JSON.stringify(tags) },
  })
  return NextResponse.json(created, { status: 201 })
}
