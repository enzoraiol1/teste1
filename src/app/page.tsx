import { prisma } from "@/lib/db"
import { DashboardClient } from "./dashboard-client"

export const dynamic = "force-dynamic"

async function getDashboardData() {
  const [totalCases, totalFlashcards, totalReports, recentLogs, dueFlashcards, recentCases] =
    await Promise.all([
      prisma.case.count(),
      prisma.flashcard.count(),
      prisma.report.count(),
      prisma.studyLog.findMany({
        take: 7,
        orderBy: { date: "desc" },
        include: { case: { select: { title: true } } },
      }),
      prisma.flashcard.count({ where: { nextReview: { lte: new Date() } } }),
      prisma.case.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, modality: true, region: true, difficulty: true, createdAt: true },
      }),
    ])

  return { totalCases, totalFlashcards, totalReports, recentLogs, dueFlashcards, recentCases }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  return <DashboardClient data={data} />
}
