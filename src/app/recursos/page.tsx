"use client"

import { useState } from "react"
import { BookOpen, ExternalLink, Filter, Globe, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { EXTERNAL_RESOURCES } from "@/lib/constants"

const ALL_TAGS = Array.from(
  new Set(EXTERNAL_RESOURCES.flatMap((cat) => cat.items.flatMap((item) => item.tags)))
).sort()

export default function RecursosPage() {
  const [search, setSearch] = useState("")
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeLang, setActiveLang] = useState<string | null>(null)

  const filtered = EXTERNAL_RESOURCES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => {
      const matchSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      const matchTag = !activeTag || item.tags.includes(activeTag)
      const matchLang = !activeLang || item.language === activeLang
      return matchSearch && matchTag && matchLang
    }),
  })).filter((cat) => cat.items.length > 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Recursos de Estudo</h1>
        <p className="mt-1 text-slate-500">
          Referências curadas para radiologia musculoesquelética e ortopedia
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Buscar recursos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            {["EN", "PT"].map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(activeLang === lang ? null : lang)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  activeLang === lang
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Tag filters */}
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
            <Filter className="h-3 w-3" /> Tags:
          </span>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === tag
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Resources grid */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <p className="text-slate-500">Nenhum recurso encontrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {filtered.map((category) => (
            <div key={category.category}>
              <h2 className="mb-4 text-lg font-semibold text-slate-800">{category.category}</h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {category.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <Card className="h-full transition-all hover:shadow-md hover:border-blue-200 group-hover:bg-blue-50/30">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                            {item.name}
                          </CardTitle>
                          <div className="flex shrink-0 items-center gap-1.5">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                item.language === "PT"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {item.language}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-500" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-slate-600">{item.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Study tip box */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="py-6">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Dica de estudo sistemático</h3>
              <p className="mt-1 text-sm text-slate-600">
                Para maximizar seu aprendizado, combine os recursos externos com o sistema interno:
                após estudar um caso no <strong>Radiopaedia</strong> ou <strong>Radiology Assistant</strong>,
                cadastre-o na <strong>Biblioteca de Casos</strong> e crie flashcards para revisão espaçada.
                Use a ferramenta de <strong>Diagnóstico Diferencial</strong> com IA para aprofundar sua análise.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
