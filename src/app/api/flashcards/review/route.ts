import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { z } from "zod"

const ReviewSchema = z.object({
  id: z.string(),
  quality: z.number().min(0).max(5), // SM-2: 0=blackout, 5=perfect
})

// SM-2 spaced repetition algorithm
function sm2(quality: number, repetitions: number, easeFactor: number, interval: number) {
  let newRepetitions = repetitions
  let newEaseFactor = easeFactor
  let newInterval = interval

  if (quality >= 3) {
    if (repetitions === 0) newInterval = 1
    else if (repetitions === 1) newInterval = 6
    else newInterval = Math.round(interval * easeFactor)
    newRepetitions += 1
  } else {
    newRepetitions = 0
    newInterval = 1
  }

  newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  if (newEaseFactor < 1.3) newEaseFactor = 1.3

  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + newInterval)

  return { repetitions: newRepetitions, easeFactor: newEaseFactor, interval: newInterval, nextReview }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = ReviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { id, quality } = parsed.data
  const card = await prisma.flashcard.findUnique({ where: { id } })
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { repetitions, easeFactor, interval, nextReview } = sm2(
    quality,
    card.repetitions,
    card.easeFactor,
    card.interval
  )

  const updated = await prisma.flashcard.update({
    where: { id },
    data: { repetitions, easeFactor, interval, nextReview },
  })

  await prisma.studyLog.create({
    data: { type: "flashcard", score: quality, caseId: card.caseId ?? undefined },
  })

  return NextResponse.json(updated)
}
