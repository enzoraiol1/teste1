"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink, Filter, Plus, Search, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DIFFICULTIES, MODALITIES, REGIONS } from "@/lib/constants"

interface CaseItem {
  id: string
  title: string
  modality: string
  region: string
  difficulty: string
  diagnosis: string
  tags: string
  reviewed: boolean
  createdAt: string
  source?: string
}

const diffConfig: Record<string, { label: string; variant: "success" | "warning" | "destructive" }> = {
  facil: { label: "Fácil", variant: "success" },
  medio: { label: "Médio", variant: "warning" },
  dificil: { label: "Difícil", variant: "destructive" },
}

export default function CasosPage() {
  const [cases, setCases] = useState<CaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [modalityFilter, setModalityFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [diffFilter, setDiffFilter] = useState("all")

  const fetchCases = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (modalityFilter !== "all") params.set("modality", modalityFilter)
    if (regionFilter !== "all") params.set("region", regionFilter)
    if (diffFilter !== "all") params.set("difficulty", diffFilter)

    const res = await fetch(`/api/casos?${params}`)
    const data = await res.json()
    setCases(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCases() // eslint-disable-line react-hooks/exhaustive-deps
  }, [search, modalityFilter, regionFilter, diffFilter])

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este caso?")) return
    await fetch(`/api/casos/${id}`, { method: "DELETE" })
    setCases((prev) => prev.filter((c) => c.id !== id))
  }

  const getModalityLabel = (v: string) => MODALITIES.find((m) => m.value === v)?.label ?? v.toUpperCase()
  const getRegionLabel = (v: string) => REGIONS.find((r) => r.value === v)?.label ?? v

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Biblioteca de Casos</h1>
          <p className="mt-1 text-slate-500">Gerencie e estude seus casos radiológicos</p>
        </div>
        <Button asChild>
          <Link href="/casos/novo">
            <Plus className="h-4 w-4" />
            Novo Caso
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Buscar casos, diagnósticos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={modalityFilter} onValueChange={setModalityFilter}>
              <SelectTrigger className="w-44">
                <Filter className="mr-2 h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder="Modalidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas modalidades</SelectItem>
                {MODALITIES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas regiões</SelectItem>
                {REGIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={diffFilter} onValueChange={setDiffFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : cases.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="py-16 text-center">
            <p className="text-slate-500">Nenhum caso encontrado.</p>
            <Button className="mt-4" asChild>
              <Link href="/casos/novo">Adicionar primeiro caso</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cases.map((c) => {
            const diff = diffConfig[c.difficulty] ?? { label: c.difficulty, variant: "secondary" as const }
            const tags = (() => { try { return JSON.parse(c.tags) as string[] } catch { return [] } })()
            return (
              <Card key={c.id} className="group flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/casos/${c.id}`} className="flex-1">
                      <CardTitle className="text-base leading-snug hover:text-blue-600 transition-colors">
                        {c.title}
                      </CardTitle>
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      {getModalityLabel(c.modality)}
                    </span>
                    <Badge variant={diff.variant}>{diff.label}</Badge>
                    {c.reviewed && <Badge variant="success">Revisado</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-2 pt-0">
                  <p className="text-xs font-medium text-slate-500">{getRegionLabel(c.region)}</p>
                  <p className="text-sm text-slate-700 line-clamp-2">{c.diagnosis}</p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {c.source && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" /> {c.source}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
