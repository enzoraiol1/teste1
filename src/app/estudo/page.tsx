"use client"

import { useCallback, useEffect, useState } from "react"
import {
  BookOpen,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { FLASHCARD_CATEGORIES } from "@/lib/constants"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Flashcard {
  id: string
  question: string
  answer: string
  category: string
  difficulty: string
  nextReview: string
  repetitions: number
  easeFactor: number
  interval: number
}

const QUALITY_LABELS = [
  { q: 0, label: "Esqueci completamente", color: "bg-red-500" },
  { q: 1, label: "Muito difícil", color: "bg-red-400" },
  { q: 2, label: "Difícil", color: "bg-orange-400" },
  { q: 3, label: "Lembrei com esforço", color: "bg-yellow-400" },
  { q: 4, label: "Fácil com dúvida", color: "bg-green-400" },
  { q: 5, label: "Perfeito!", color: "bg-green-600" },
]

export default function EstudoPage() {
  const [allCards, setAllCards] = useState<Flashcard[]>([])
  const [dueCards, setDueCards] = useState<Flashcard[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reviewing, setReviewing] = useState(false)
  const [sessionDone, setSessionDone] = useState(false)
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, correct: 0 })
  const [newCard, setNewCard] = useState({ question: "", answer: "", category: "semiologia", difficulty: "medio" })
  const [savingCard, setSavingCard] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiTopic, setAiTopic] = useState("")
  const [aiCards, setAiCards] = useState("")

  const fetchCards = useCallback(async () => {
    setLoading(true)
    const [all, due] = await Promise.all([
      fetch("/api/flashcards").then((r) => r.json()),
      fetch("/api/flashcards?due=true").then((r) => r.json()),
    ])
    setAllCards(all)
    setDueCards(due)
    setLoading(false)
  }, [])

  useEffect(() => { fetchCards() }, [fetchCards])

  const currentCard = dueCards[currentIdx]

  const handleReview = async (quality: number) => {
    if (!currentCard) return
    setReviewing(true)
    await fetch("/api/flashcards/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: currentCard.id, quality }),
    })
    setSessionStats((s) => ({ reviewed: s.reviewed + 1, correct: quality >= 3 ? s.correct + 1 : s.correct }))
    setShowAnswer(false)
    if (currentIdx + 1 >= dueCards.length) {
      setSessionDone(true)
    } else {
      setCurrentIdx((i) => i + 1)
    }
    setReviewing(false)
  }

  const resetSession = () => {
    setCurrentIdx(0)
    setShowAnswer(false)
    setSessionDone(false)
    setSessionStats({ reviewed: 0, correct: 0 })
    fetchCards()
  }

  const saveNewCard = async () => {
    if (!newCard.question || !newCard.answer) return
    setSavingCard(true)
    await fetch("/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard),
    })
    setNewCard({ question: "", answer: "", category: "semiologia", difficulty: "medio" })
    await fetchCards()
    setSavingCard(false)
  }

  const generateAICards = async () => {
    if (!aiTopic) return
    setAiLoading(true)
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pearls",
        data: { topic: aiTopic },
      }),
    })
    const data = await res.json()
    setAiCards(data.result ?? data.error ?? "Erro")
    setAiLoading(false)
  }

  if (loading) return <div className="flex items-center gap-2 text-slate-500"><Loader2 className="animate-spin h-4 w-4" /> Carregando...</div>

  const progress = dueCards.length > 0 ? (currentIdx / dueCards.length) * 100 : 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Estudo Dirigido</h1>
        <p className="mt-1 text-slate-500">Revisão com repetição espaçada (algoritmo SM-2) e geração de conteúdo com IA</p>
      </div>

      <Tabs defaultValue="revisao">
        <TabsList>
          <TabsTrigger value="revisao" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Revisão ({dueCards.length} pendentes)
          </TabsTrigger>
          <TabsTrigger value="criar" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Criar Flashcard
          </TabsTrigger>
          <TabsTrigger value="ia" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Estudo com IA
          </TabsTrigger>
          <TabsTrigger value="todos" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Todos ({allCards.length})
          </TabsTrigger>
        </TabsList>

        {/* Review tab */}
        <TabsContent value="revisao" className="space-y-4">
          {sessionDone || dueCards.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {dueCards.length === 0 ? "Nenhum flashcard para revisar!" : "Sessão concluída!"}
                    </h2>
                    <p className="mt-1 text-slate-500">
                      {sessionDone
                        ? `Você revisou ${sessionStats.reviewed} cards. Acerto: ${sessionStats.reviewed > 0 ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100) : 0}%`
                        : "Todos os flashcards estão em dia. Adicione novos ou volte amanhã!"}
                    </p>
                  </div>
                  {sessionDone && (
                    <div className="w-48">
                      <Progress value={sessionStats.reviewed > 0 ? (sessionStats.correct / sessionStats.reviewed) * 100 : 0} className="h-3" />
                    </div>
                  )}
                  <Button onClick={resetSession}>
                    <RefreshCw className="h-4 w-4" />
                    Atualizar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>{currentIdx + 1} de {dueCards.length}</span>
                  <span>{sessionStats.reviewed > 0 ? `${Math.round((sessionStats.correct / sessionStats.reviewed) * 100)}% correto` : ""}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Flashcard */}
              <div className="max-w-2xl mx-auto">
                <Card className="min-h-[280px]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{FLASHCARD_CATEGORIES.find((c) => c.value === currentCard.category)?.label ?? currentCard.category}</Badge>
                      <span className="text-xs text-slate-400">Repetições: {currentCard.repetitions}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Pergunta</p>
                      <p className="text-lg font-medium text-slate-900">{currentCard.question}</p>
                    </div>

                    {showAnswer ? (
                      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">Resposta</p>
                        <p className="text-slate-800 whitespace-pre-wrap">{currentCard.answer}</p>
                      </div>
                    ) : (
                      <Button className="w-full" variant="outline" onClick={() => setShowAnswer(true)}>
                        <Eye className="h-4 w-4" />
                        Revelar resposta
                      </Button>
                    )}

                    {showAnswer && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-600 text-center">Como foi sua lembrança?</p>
                        <div className="grid grid-cols-3 gap-2">
                          {QUALITY_LABELS.map(({ q, label, color }) => (
                            <button
                              key={q}
                              onClick={() => handleReview(q)}
                              disabled={reviewing}
                              className={`${color} text-white rounded-lg py-2 px-1 text-xs font-medium transition-opacity hover:opacity-90 disabled:opacity-50`}
                            >
                              {q} - {label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setCurrentIdx((i) => Math.max(0, i - 1)); setShowAnswer(false) }}
                    disabled={currentIdx === 0}
                  >
                    <ChevronLeft className="h-4 w-4" /> Anterior
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setCurrentIdx((i) => Math.min(dueCards.length - 1, i + 1)); setShowAnswer(false) }}
                    disabled={currentIdx >= dueCards.length - 1}
                  >
                    Próximo <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* Create tab */}
        <TabsContent value="criar">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Criar Novo Flashcard</CardTitle>
              <CardDescription>Adicione um flashcard de radiologia musculoesquelética</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Categoria</label>
                  <Select value={newCard.category} onValueChange={(v) => setNewCard((p) => ({ ...p, category: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FLASHCARD_CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Dificuldade</label>
                  <Select value={newCard.difficulty} onValueChange={(v) => setNewCard((p) => ({ ...p, difficulty: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facil">Fácil</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="dificil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Pergunta *</label>
                <Textarea
                  placeholder="Ex: Qual o sinal de Bankart na RM? Quais estruturas envolvidas?"
                  value={newCard.question}
                  onChange={(e) => setNewCard((p) => ({ ...p, question: e.target.value }))}
                  rows={3}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Resposta *</label>
                <Textarea
                  placeholder="Resposta detalhada..."
                  value={newCard.answer}
                  onChange={(e) => setNewCard((p) => ({ ...p, answer: e.target.value }))}
                  rows={4}
                />
              </div>
              <Button onClick={saveNewCard} disabled={savingCard || !newCard.question || !newCard.answer}>
                {savingCard ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Salvar Flashcard
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Study tab */}
        <TabsContent value="ia" className="space-y-4">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Gerador de Conteúdo com IA
              </CardTitle>
              <CardDescription>
                Obtenha pearls, resumos e pontos-chave sobre qualquer tópico de radiologia musculoesquelética
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Ex: Lesões do manguito rotador, Critérios de Kellgren-Lawrence, Sinal de Hill-Sachs..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generateAICards()}
                />
                <Button onClick={generateAICards} disabled={aiLoading || !aiTopic}>
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
                  Gerar
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  "Ruptura do LCA - RM",
                  "Artrose do joelho - Radiografia",
                  "Lesão SLAP - RM Ombro",
                  "Espondiloartrite - Sacroilíacas",
                  "Tendinite calcificante",
                  "Fratura por estresse",
                ].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setAiTopic(topic)}
                    className="rounded-lg border border-slate-200 p-2.5 text-left text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {aiCards && (
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">{aiCards}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All cards tab */}
        <TabsContent value="todos">
          <div className="space-y-3">
            {allCards.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-slate-500">Nenhum flashcard criado ainda.</p>
                </CardContent>
              </Card>
            ) : (
              allCards.map((card) => (
                <Card key={card.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {FLASHCARD_CATEGORIES.find((c) => c.value === card.category)?.label ?? card.category}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            Próxima revisão: {new Date(card.nextReview).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="font-medium text-slate-900">{card.question}</p>
                        <p className="mt-1 text-sm text-slate-500 line-clamp-2">{card.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
