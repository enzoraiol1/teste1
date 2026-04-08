"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Plus, Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MODALITIES, REGIONS } from "@/lib/constants"

interface Report {
  id: string
  title: string
  modality: string
  region: string
  aiGenerated: boolean
  createdAt: string
}

export default function LaudosPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/laudos")
      .then((r) => r.json())
      .then((d) => { setReports(d); setLoading(false) })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este laudo?")) return
    await fetch(`/api/laudos/${id}`, { method: "DELETE" })
    setReports((prev) => prev.filter((r) => r.id !== id))
  }

  const getModalityLabel = (v: string) => MODALITIES.find((m) => m.value === v)?.label ?? v
  const getRegionLabel = (v: string) => REGIONS.find((r) => r.value === v)?.label ?? v

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Laudos</h1>
          <p className="mt-1 text-slate-500">Editor de laudos estruturados com templates e IA</p>
        </div>
        <Button asChild>
          <Link href="/laudos/novo">
            <Plus className="h-4 w-4" />
            Novo Laudo
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-36 animate-pulse rounded-xl bg-slate-200" />)}
        </div>
      ) : reports.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-300">
          <CardContent className="py-16 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500">Nenhum laudo elaborado ainda.</p>
            <p className="text-sm text-slate-400 mt-1">Crie laudos com templates estruturados e assistência de IA.</p>
            <Button className="mt-4" asChild>
              <Link href="/laudos/novo">Criar primeiro laudo</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {reports.map((r) => (
            <Card key={r.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <Link href={`/laudos/${r.id}`}>
                    <CardTitle className="text-base hover:text-blue-600 transition-colors">{r.title}</CardTitle>
                  </Link>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs rounded-md bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
                    {getModalityLabel(r.modality)}
                  </span>
                  {r.aiGenerated && (
                    <Badge variant="default" className="gap-1">
                      <Sparkles className="h-3 w-3" /> IA
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500">{getRegionLabel(r.region)}</p>
                <p className="text-xs text-slate-400">
                  {new Date(r.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
