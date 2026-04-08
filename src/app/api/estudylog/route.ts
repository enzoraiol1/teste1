import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const log = await prisma.studyLog.create({
    data: {
      type: body.type ?? "caso",
      caseId: body.caseId,
      score: body.score,
      duration: body.duration,
      notes: body.notes,
    },
  })
  return NextResponse.json(log, { status: 201 })
}
