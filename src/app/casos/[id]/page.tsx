"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  Brain,
  CheckCircle,
  Circle,
  ExternalLink,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FLASHCARD_CATEGORIES, MODALITIES, REGIONS } from "@/lib/constants"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CaseDetail {
  id: string
  title: string
  modality: string
  region: string
  difficulty: string
  findings: string
  diagnosis: string
  pearls?: string
  tags: string
  reviewed: boolean
  source?: string
  sourceUrl?: string
  createdAt: string
  flashcards: Array<{
    id: string
    question: string
    answer: string
    category: string
    nextReview: string
  }>
}

const diffConfig: Record<string, { label: string; variant: "success" | "warning" | "destructive" }> = {
  facil: { label: "Fácil", variant: "success" },
  medio: { label: "Médio", variant: "warning" },
  dificil: { label: "Difícil", variant: "destructive" },
}

export default function CasoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [caso, setCaso] = useState<CaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiPearls, setAiPearls] = useState("")
  const [newCard, setNewCard] = useState({ question: "", answer: "", category: "semiologia" })
  const [addingCard, setAddingCard] = useState(false)

  useEffect(() => {
    fetch(`/api/casos/${id}`)
      .then((r) => r.json())
      .then((d) => { setCaso(d); setLoading(false) })
  }, [id])

  const toggleReviewed = async () => {
    if (!caso) return
    const res = await fetch(`/api/casos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewed: !caso.reviewed }),
    })
    const updated = await res.json()
    setCaso((prev) => prev ? { ...prev, reviewed: updated.reviewed } : prev)

    await fetch("/api/estudylog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "caso", caseId: id }),
    }).catch(() => null)
  }

  const generatePearls = async () => {
    if (!caso) return
    setAiLoading(true)
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pearls",
        data: { topic: `${caso.diagnosis} - ${MODALITIES.find((m) => m.value === caso.modality)?.label ?? caso.modality} - ${caso.region}` },
      }),
    })
    const data = await res.json()
    setAiPearls(data.result ?? data.error ?? "Erro")
    setAiLoading(false)
  }

  const addFlashcard = async () => {
    if (!newCard.question || !newCard.answer) return
    setAddingCard(true)
    const res = await fetch("/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCard, caseId: id }),
    })
    const created = await res.json()
    setCaso((prev) =>
      prev ? { ...prev, flashcards: [...prev.flashcards, created] } : prev
    )
    setNewCard({ question: "", answer: "", category: "semiologia" })
    setAddingCard(false)
  }

  const handleDelete = async () => {
    if (!confirm("Excluir este caso permanentemente?")) return
    await fetch(`/api/casos/${id}`, { method: "DELETE" })
    router.push("/casos")
  }

  if (loading) return <div className="flex items-center gap-2 text-slate-500"><Loader2 className="animate-spin h-4 w-4" /> Carregando...</div>
  if (!caso) return <p className="text-slate-500">Caso não encontrado.</p>

  const tags = (() => { try { return JSON.parse(caso.tags) as string[] } catch { return [] } })()
  const diff = diffConfig[caso.difficulty] ?? { label: caso.difficulty, variant: "secondary" as const }
  const getModalityLabel = (v: string) => MODALITIES.find((m) => m.value === v)?.label ?? v
  const getRegionLabel = (v: string) => REGIONS.find((r) => r.value === v)?.label ?? v

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/casos"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{caso.title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {getModalityLabel(caso.modality)}
              </span>
              <span className="text-xs text-slate-500">{getRegionLabel(caso.region)}</span>
              <Badge variant={diff.variant}>{diff.label}</Badge>
              {caso.reviewed && <Badge variant="success">Revisado</Badge>}
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleReviewed}
          >
            {caso.reviewed ? (
              <><CheckCircle className="h-4 w-4 text-green-500" /> Revisado</>
            ) : (
              <><Circle className="h-4 w-4" /> Marcar revisado</>
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-400 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="achados">
        <TabsList className="w-full">
          <TabsTrigger value="achados" className="flex-1">Achados</TabsTrigger>
          <TabsTrigger value="diagnostico" className="flex-1">Diagnóstico</TabsTrigger>
          <TabsTrigger value="pearls" className="flex-1">Pearls & IA</TabsTrigger>
          <TabsTrigger value="flashcards" className="flex-1">
            Flashcards ({caso.flashcards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achados">
          <Card>
            <CardHeader><CardTitle>Achados Radiológicos</CardTitle></CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-slate-700">{caso.findings}</p>
              {caso.sourceUrl && (
                <a
                  href={caso.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {caso.source ?? "Fonte original"}
                </a>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostico">
          <Card>
            <CardHeader><CardTitle>Diagnóstico</CardTitle></CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-slate-700">{caso.diagnosis}</p>
              {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pearls" className="space-y-4">
          {caso.pearls && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Pearls do Caso</CardTitle></CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-slate-700">{caso.pearls}</p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-yellow-500" /> Pearls geradas por IA</CardTitle>
                <Button size="sm" onClick={generatePearls} disabled={aiLoading}>
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                  Gerar Pearls
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {aiPearls ? (
                <p className="whitespace-pre-wrap text-slate-700">{aiPearls}</p>
              ) : (
                <p className="text-slate-400 text-sm">Clique em &quot;Gerar Pearls&quot; para obter insights sobre este diagnóstico com auxílio da IA.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashcards" className="space-y-4">
          {/* Add new flashcard */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Plus className="h-4 w-4" /> Novo Flashcard</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={newCard.category} onValueChange={(v) => setNewCard((p) => ({ ...p, category: v }))}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FLASHCARD_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Pergunta..."
                rows={2}
                value={newCard.question}
                onChange={(e) => setNewCard((p) => ({ ...p, question: e.target.value }))}
              />
              <Textarea
                placeholder="Resposta..."
                rows={2}
                value={newCard.answer}
                onChange={(e) => setNewCard((p) => ({ ...p, answer: e.target.value }))}
              />
              <Button onClick={addFlashcard} disabled={addingCard || !newCard.question || !newCard.answer}>
                {addingCard ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Adicionar Flashcard
              </Button>
            </CardContent>
          </Card>

          {/* Flashcard list */}
          {caso.flashcards.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-4">Nenhum flashcard criado ainda.</p>
          ) : (
            <div className="space-y-3">
              {caso.flashcards.map((card) => (
                <Card key={card.id}>
                  <CardContent className="p-4 space-y-2">
                    <p className="font-medium text-slate-900">{card.question}</p>
                    <p className="text-slate-600 text-sm border-l-2 border-blue-200 pl-3">{card.answer}</p>
                    <p className="text-xs text-slate-400">
                      Próxima revisão: {new Date(card.nextReview).toLocaleDateString("pt-BR")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
