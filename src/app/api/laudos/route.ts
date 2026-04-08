import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const ReportSchema = z.object({
  title: z.string().min(1),
  modality: z.string().min(1),
  region: z.string().min(1),
  template: z.string().default(""),
  content: z.string().min(1),
  aiGenerated: z.boolean().default(false),
})

export async function GET() {
  const reports = await prisma.report.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json(reports)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = ReportSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const created = await prisma.report.create({ data: parsed.data })
  return NextResponse.json(created, { status: 201 })
}
