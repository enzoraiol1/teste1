"use client"

import Link from "next/link"
import {
  Activity,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Folders,
  GraduationCap,
  TrendingUp,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { REGIONS } from "@/lib/constants"

interface DashboardProps {
  data: {
    totalCases: number
    totalFlashcards: number
    totalReports: number
    dueFlashcards: number
    recentLogs: Array<{
      id: string
      type: string
      score: number | null
      duration: number | null
      date: Date
      case: { title: string } | null
    }>
    recentCases: Array<{
      id: string
      title: string
      modality: string
      region: string
      difficulty: string
      createdAt: Date
    }>
  }
}

const difficultyConfig: Record<string, { label: string; variant: "success" | "warning" | "destructive" }> = {
  facil: { label: "Fácil", variant: "success" },
  medio: { label: "Médio", variant: "warning" },
  dificil: { label: "Difícil", variant: "destructive" },
}

const logTypeLabel: Record<string, string> = {
  caso: "Caso estudado",
  flashcard: "Flashcard revisado",
  laudo: "Laudo praticado",
  ddx: "DDx realizado",
}

export function DashboardClient({ data }: DashboardProps) {
  const { totalCases, totalFlashcards, totalReports, dueFlashcards, recentLogs, recentCases } = data

  const getRegionLabel = (v: string) => REGIONS.find((r) => r.value === v)?.label ?? v

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-slate-500">
            Bem-vindo ao seu sistema de estudo de imagens em ortopedia e radiologia
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/estudo">
              <GraduationCap className="h-4 w-4" />
              Estudar Agora
            </Link>
          </Button>
          <Button asChild>
            <Link href="/casos/novo">
              <Folders className="h-4 w-4" />
              Novo Caso
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total de Casos</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{totalCases}</p>
                <p className="mt-1 text-xs text-slate-400">casos catalogados</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Folders className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-violet-100 bg-gradient-to-br from-violet-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Flashcards</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{totalFlashcards}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {dueFlashcards > 0 ? (
                    <span className="font-semibold text-orange-500">{dueFlashcards} para revisar</span>
                  ) : (
                    "em dia!"
                  )}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                <Brain className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Laudos</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{totalReports}</p>
                <p className="mt-1 text-xs text-slate-400">laudos elaborados</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Sessões de Estudo</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{recentLogs.length}</p>
                <p className="mt-1 text-xs text-slate-400">últimos 7 registros</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>Acesse as ferramentas principais</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { href: "/casos/novo", icon: Folders, label: "Cadastrar novo caso", color: "blue" },
              { href: "/laudos/novo", icon: FileText, label: "Elaborar laudo", color: "emerald" },
              { href: "/diagnostico", icon: Brain, label: "Montar diagnóstico diferencial", color: "violet" },
              { href: "/estudo", icon: GraduationCap, label: "Iniciar sessão de estudo", color: "orange" },
              { href: "/recursos", icon: BookOpen, label: "Acessar recursos externos", color: "slate" },
            ].map(({ href, icon: Icon, label, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-md bg-${color}-100`}>
                  <Icon className={`h-4 w-4 text-${color}-600`} />
                </div>
                {label}
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              Atividade Recente
            </CardTitle>
            <CardDescription>Suas últimas sessões de estudo</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLogs.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">Nenhuma atividade registrada ainda.</p>
                <p className="mt-1 text-xs text-slate-400">Comece estudando um caso!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700">
                        {logTypeLabel[log.type] ?? log.type}
                      </p>
                      {log.case && (
                        <p className="truncate text-xs text-slate-400">{log.case.title}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">
                      {new Date(log.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Study Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Progresso de Estudo
            </CardTitle>
            <CardDescription>Revisão por dificuldade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-600">Casos Fáceis Revisados</span>
                <span className="font-medium text-green-600">0 / {totalCases}</span>
              </div>
              <Progress value={0} className="h-2 [&>div]:bg-green-500" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-600">Casos Médios Revisados</span>
                <span className="font-medium text-yellow-600">0 / {totalCases}</span>
              </div>
              <Progress value={0} className="h-2 [&>div]:bg-yellow-500" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-slate-600">Casos Difíceis Revisados</span>
                <span className="font-medium text-red-600">0 / {totalCases}</span>
              </div>
              <Progress value={0} className="h-2 [&>div]:bg-red-500" />
            </div>
            <div className="pt-2">
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-slate-700">Flashcards para Revisar Hoje</span>
                <span className="font-bold text-blue-600">{dueFlashcards}</span>
              </div>
              <Progress
                value={totalFlashcards > 0 ? ((totalFlashcards - dueFlashcards) / totalFlashcards) * 100 : 0}
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases */}
      {recentCases.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Casos Recentes</CardTitle>
                <CardDescription>Últimos casos adicionados à biblioteca</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/casos">Ver todos</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCases.map((c) => {
                const diff = difficultyConfig[c.difficulty] ?? { label: c.difficulty, variant: "secondary" as const }
                return (
                  <Link
                    key={c.id}
                    href={`/casos/${c.id}`}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold uppercase text-blue-700">
                        {c.modality}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{c.title}</p>
                        <p className="text-sm text-slate-500">{getRegionLabel(c.region)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={diff.variant}>{diff.label}</Badge>
                      <span className="text-xs text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {totalCases === 0 && (
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Folders className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Comece sua jornada!</h3>
            <p className="mt-2 text-slate-500 max-w-md mx-auto">
              Adicione seu primeiro caso radiológico, crie flashcards ou use o gerador de laudos assistido por IA.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild>
                <Link href="/casos/novo">
                  <Folders className="h-4 w-4" />
                  Adicionar Caso
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/diagnostico">
                  <Brain className="h-4 w-4" />
                  Testar DDx com IA
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
