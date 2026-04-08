"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Copy, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MODALITIES, REGIONS, REPORT_TEMPLATES } from "@/lib/constants"

export default function NovoLaudoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    modality: "",
    region: "",
    clinicalInfo: "",
    content: "",
    aiGenerated: false,
  })

  const update = (key: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }))

  const applyTemplate = () => {
    const template = REPORT_TEMPLATES[form.modality]?.[form.region]
    if (template) update("content", template)
    else alert("Nenhum template disponível para esta combinação. Você pode usar o campo livre.")
  }

  const generateWithAI = async () => {
    if (!form.modality || !form.region || !form.clinicalInfo) {
      alert("Preencha a modalidade, região e achados clínicos para gerar com IA.")
      return
    }
    setAiLoading(true)
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "report",
        data: { modality: form.modality, region: form.region, findings: form.clinicalInfo },
      }),
    })
    const data = await res.json()
    if (data.result) {
      update("content", data.result)
      update("aiGenerated", true)
    } else {
      alert(data.error ?? "Erro ao gerar com IA")
    }
    setAiLoading(false)
  }

  const handleSave = async () => {
    if (!form.title || !form.modality || !form.region || !form.content) {
      alert("Preencha título, modalidade, região e conteúdo do laudo.")
      return
    }
    setSaving(true)
    const res = await fetch("/api/laudos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        modality: form.modality,
        region: form.region,
        template: "",
        content: form.content,
        aiGenerated: form.aiGenerated,
      }),
    })
    if (res.ok) {
      const created = await res.json()
      router.push(`/laudos/${created.id}`)
    } else {
      alert("Erro ao salvar.")
    }
    setSaving(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(form.content)
    alert("Laudo copiado para a área de transferência!")
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/laudos"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Novo Laudo</h1>
          <p className="text-sm text-slate-500">Use templates, escreva manualmente ou gere com IA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left panel - config */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Configuração</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Título</label>
                <Input
                  placeholder="Ex: RM Joelho direito"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Modalidade</label>
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
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Região</label>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achados / Informação Clínica</CardTitle>
              <CardDescription>Para geração de laudo com IA</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Descreva os achados observados ou informações clínicas relevantes para a geração do laudo..."
                value={form.clinicalInfo}
                onChange={(e) => update("clinicalInfo", e.target.value)}
                rows={5}
              />
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button className="w-full" variant="outline" onClick={applyTemplate}>
              Usar Template
            </Button>
            <Button className="w-full" onClick={generateWithAI} disabled={aiLoading}>
              {aiLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Gerar com IA
            </Button>
          </div>
        </div>

        {/* Right panel - editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Editor de Laudo</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!form.content}>
                    <Copy className="h-3.5 w-3.5" />
                    Copiar
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Salvar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="O laudo aparecerá aqui. Você pode usar um template, gerar com IA ou escrever livremente..."
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                rows={24}
                className="font-mono text-sm resize-none"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
