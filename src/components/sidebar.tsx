"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Activity,
  BookOpen,
  Brain,
  FileText,
  Folders,
  GraduationCap,
  Layers,
  Stethoscope,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: Activity,
    description: "Visão geral e estatísticas",
  },
  {
    href: "/casos",
    label: "Casos",
    icon: Folders,
    description: "Biblioteca de casos",
  },
  {
    href: "/laudos",
    label: "Laudos",
    icon: FileText,
    description: "Modelos e editor",
  },
  {
    href: "/diagnostico",
    label: "Diagnóstico Diferencial",
    icon: Brain,
    description: "Ferramenta de DDx com IA",
  },
  {
    href: "/estudo",
    label: "Estudo Dirigido",
    icon: GraduationCap,
    description: "Flashcards e revisão",
  },
  {
    href: "/recursos",
    label: "Recursos",
    icon: BookOpen,
    description: "Links e referências",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <Stethoscope className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">OrthoRadio</p>
          <p className="text-xs text-slate-500">Estudo de Imagem</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Menu Principal
        </p>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                )}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3">
          <Layers className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-xs font-semibold text-blue-900">Powered by Claude AI</p>
            <p className="text-xs text-blue-600">Assistente inteligente ativo</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
