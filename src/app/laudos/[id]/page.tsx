"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Copy, Loader2, Save, Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MODALITIES, REGIONS } from "@/lib/constants"

interface Report {
  id: string
  title: string
  modality: string
  region: string
  content: string
  aiGenerated: boolean
  createdAt: string
}

export default function LaudoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [report, setReport] = useState<Report | null>(null)
  const [content, setContent] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/laudos/${id}`)
      .then((r) => r.json())
      .then((d) => { setReport(d); setContent(d.content); setLoading(false) })
  }, [id])

  const save = async () => {
    setSaving(true)
    await fetch(`/api/laudos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    setSaving(false)
  }

  const enhanceWithAI = async () => {
    if (!report) return
    setAiLoading(true)
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "description",
        data: { modality: report.modality, region: report.region, findings: content },
      }),
    })
    const data = await res.json()
    if (data.result) setContent(data.result)
    setAiLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm("Excluir este laudo?")) return
    await fetch(`/api/laudos/${id}`, { method: "DELETE" })
    router.push("/laudos")
  }

  if (loading) return <div className="flex items-center gap-2 text-slate-500"><Loader2 className="animate-spin h-4 w-4" /> Carregando...</div>
  if (!report) return <p>Laudo não encontrado.</p>

  const getModalityLabel = (v: string) => MODALITIES.find((m) => m.value === v)?.label ?? v
  const getRegionLabel = (v: string) => REGIONS.find((r) => r.value === v)?.label ?? v

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/laudos"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{report.title}</h1>
            <div className="mt-1 flex gap-2">
              <span className="text-xs rounded-md bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
                {getModalityLabel(report.modality)}
              </span>
              <span className="text-xs text-slate-500">{getRegionLabel(report.region)}</span>
              {report.aiGenerated && (
                <Badge variant="default" className="gap-1 text-xs">
                  <Sparkles className="h-3 w-3" /> Gerado por IA
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(content)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={enhanceWithAI} disabled={aiLoading}>
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Aprimorar com IA
          </Button>
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Conteúdo do Laudo</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={28}
            className="font-mono text-sm resize-none"
          />
        </CardContent>
      </Card>
    </div>
  )
}
