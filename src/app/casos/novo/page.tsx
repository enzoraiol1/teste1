"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Plus, Sparkles, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DIFFICULTIES, MODALITIES, REGIONS } from "@/lib/constants"

export default function NovoCasoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [form, setForm] = useState({
    title: "",
    modality: "",
    region: "",
    difficulty: "medio",
    findings: "",
    diagnosis: "",
    pearls: "",
    tags: [] as string[],
    source: "",
    sourceUrl: "",
  })

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const addTag = () => {
    const t = newTag.trim().toLowerCase()
    if (t && !form.tags.includes(t)) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }))
    }
    setNewTag("")
  }

  const removeTag = (tag: string) => setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }))

  const generateDiagnosis = async () => {
    if (!form.findings || !form.modality || !form.region) {
      alert("Preencha modalidade, região e achados para gerar diagnóstico com IA.")
      return
    }
    setAiLoading(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "ddx",
          data: { modality: form.modality, region: form.region, findings: form.findings },
        }),
      })
      const data = await res.json()
      if (data.result) {
        update("diagnosis", data.result)
      } else {
        alert(data.error ?? "Erro ao gerar com IA")
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.modality || !form.region || !form.findings || !form.diagnosis) {
      alert("Preencha todos os campos obrigatórios.")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/casos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const created = await res.json()
        router.push(`/casos/${created.id}`)
      } else {
        alert("Erro ao salvar caso.")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/casos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Novo Caso</h1>
          <p className="text-sm text-slate-500">Adicione um caso radiológico à sua biblioteca</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Título do caso *</label>
              <Input
                placeholder="Ex: Ruptura do LCA com edema ósseo"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Modalidade *</label>
                <Select value={form.modality} onValueChange={(v) => update("modality", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MODALITIES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Região anatômica *</label>
                <Select value={form.region} onValueChange={(v) => update("region", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Dificuldade</label>
              <Select value={form.difficulty} onValueChange={(v) => update("difficulty", v)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achados Radiológicos</CardTitle>
            <CardDescription>Descreva os achados observados no exame</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Descreva os achados radiológicos: sinal, localização, extensão, características..."
              value={form.findings}
              onChange={(e) => update("findings", e.target.value)}
              rows={6}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Diagnóstico</CardTitle>
                <CardDescription>Diagnóstico principal e diferencial</CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateDiagnosis}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Gerar com IA
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Diagnóstico principal, diferencial e justificativas..."
              value={form.diagnosis}
              onChange={(e) => update("diagnosis", e.target.value)}
              rows={6}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pearls & Referência</CardTitle>
            <CardDescription>Pontas de diamante clínicas e fonte do caso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Pearls radiológicas, dicas clínicas, armadilhas diagnósticas..."
              value={form.pearls}
              onChange={(e) => update("pearls", e.target.value)}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Fonte</label>
                <Input
                  placeholder="Ex: Radiopaedia, Radiology Assistant..."
                  value={form.source}
                  onChange={(e) => update("source", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">URL da fonte</label>
                <Input
                  placeholder="https://..."
                  value={form.sourceUrl}
                  onChange={(e) => update("sourceUrl", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" size="icon" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {form.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      #{tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Salvar Caso
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/casos">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
