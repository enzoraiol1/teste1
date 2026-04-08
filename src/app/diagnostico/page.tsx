"use client"

import { useState } from "react"
import { Brain, ChevronDown, ChevronUp, Loader2, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MODALITIES, REGIONS } from "@/lib/constants"

const EXAMPLE_CASES = [
  {
    label: "RM Joelho - Achados de menisco",
    modality: "rm",
    region: "joelho",
    age: "35",
    gender: "Masculino",
    findings: "Sinal aumentado em T2 no corno posterior do menisco medial, estendendo-se à superfície articular inferior. Derrame articular moderado. Cartilagem articular preservada.",
  },
  {
    label: "Rx Ombro - Calcificação periarticular",
    modality: "rx",
    region: "ombro",
    age: "48",
    gender: "Feminino",
    findings: "Calcificação densa de 2,3 cm na região do tendão supraespinhal. Espaço subacromial preservado. Sem alterações ósseas.",
  },
  {
    label: "TC Coluna - Alteração degenerativa",
    modality: "tc",
    region: "coluna-lombar",
    age: "62",
    gender: "Masculino",
    findings: "Redução do espaço discal L4-L5 e L5-S1. Osteofitose marginal vertebral. Hipertrofia facetária bilateral. Estenose do canal vertebral em L4-L5.",
  },
]

export default function DiagnosticoPage() {
  const [form, setForm] = useState({
    modality: "",
    region: "",
    age: "",
    gender: "",
    findings: "",
  })
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const loadExample = (ex: (typeof EXAMPLE_CASES)[number]) => {
    setForm({ modality: ex.modality, region: ex.region, age: ex.age, gender: ex.gender, findings: ex.findings })
    setResult("")
  }

  const handleGenerate = async () => {
    if (!form.modality || !form.region || !form.findings) {
      alert("Preencha modalidade, região e achados.")
      return
    }
    setLoading(true)
    setResult("")
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "ddx", data: form }),
    })
    const data = await res.json()
    setResult(data.result ?? data.error ?? "Erro desconhecido")
    setLoading(false)

    await fetch("/api/estudylog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "ddx" }),
    }).catch(() => null)
  }

  const getPearlsForTopic = async () => {
    if (!form.findings && !result) {
      alert("Gere um diagnóstico diferencial primeiro.")
      return
    }
    setLoading(true)
    const topic = `${MODALITIES.find((m) => m.value === form.modality)?.label ?? form.modality} - ${REGIONS.find((r) => r.value === form.region)?.label ?? form.region} - ${form.findings.substring(0, 100)}`
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pearls", data: { topic } }),
    })
    const data = await res.json()
    setResult((prev) => prev + "\n\n---\n\n" + (data.result ?? data.error ?? "Erro"))
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Diagnóstico Diferencial</h1>
        <p className="mt-1 text-slate-500">Ferramenta com IA para elaborar diagnósticos diferenciais sistemáticos</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Input panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Caso</CardTitle>
              <CardDescription>Informe os dados para análise pela IA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Modalidade *</label>
                <Select value={form.modality} onValueChange={(v) => update("modality", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a modalidade..." />
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
                    <SelectValue placeholder="Selecione a região..." />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Idade</label>
                  <Input
                    type="number"
                    placeholder="anos"
                    value={form.age}
                    onChange={(e) => update("age", e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Sexo</label>
                  <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Achados radiológicos *</label>
                <Textarea
                  placeholder="Descreva os achados observados no exame de imagem..."
                  value={form.findings}
                  onChange={(e) => update("findings", e.target.value)}
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Button className="w-full" onClick={handleGenerate} disabled={loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Brain className="h-4 w-4" />
                  )}
                  Gerar Diagnóstico Diferencial
                </Button>
                {result && (
                  <Button variant="outline" className="w-full" onClick={getPearlsForTopic} disabled={loading}>
                    <Sparkles className="h-4 w-4" />
                    Adicionar Pearls
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => { setForm({ modality: "", region: "", age: "", gender: "", findings: "" }); setResult("") }}
                >
                  <RotateCcw className="h-4 w-4" />
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Example cases */}
          <Card>
            <CardHeader>
              <button
                className="flex w-full items-center justify-between"
                onClick={() => setExpandedSection(expandedSection === "examples" ? null : "examples")}
              >
                <CardTitle className="text-sm">Casos de exemplo</CardTitle>
                {expandedSection === "examples" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </CardHeader>
            {expandedSection === "examples" && (
              <CardContent className="space-y-2">
                {EXAMPLE_CASES.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => loadExample(ex)}
                    className="w-full rounded-lg border border-slate-200 p-3 text-left text-sm transition-colors hover:bg-slate-50"
                  >
                    <p className="font-medium text-slate-800">{ex.label}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{ex.findings}</p>
                  </button>
                ))}
              </CardContent>
            )}
          </Card>
        </div>

        {/* Result panel */}
        <div className="lg:col-span-3">
          <Card className="min-h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Análise da IA
              </CardTitle>
              <CardDescription>
                Diagnóstico diferencial estruturado por Claude AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                  <p className="text-slate-500">Analisando achados e gerando diagnóstico diferencial...</p>
                </div>
              ) : result ? (
                <div className="prose prose-slate max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed">{result}</pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <Brain className="h-8 w-8 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-600">Aguardando dados do caso</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Preencha os achados radiológicos e clique em &quot;Gerar Diagnóstico Diferencial&quot;
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Você também pode usar um dos casos de exemplo para testar a ferramenta
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
