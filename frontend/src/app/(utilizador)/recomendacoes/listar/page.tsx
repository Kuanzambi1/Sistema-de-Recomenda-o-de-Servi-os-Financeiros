"use client"

import { useState, useMemo } from "react"
import { Recomendacao } from "@/types"
import { mockRecomendacoes } from "@/lib/mock-data"
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import Link from "next/link"

type FiltroTipo = "todos" | "credito" | "seguro"
type FiltroStatus = "todos" | "aceite" | "visualizado" | "nao_visto"

const ITEMS_PER_PAGE = 8

const statusMap: Record<string, { label: string; text: string; bg: string }> = {
  aceite: { label: "Aceite", text: "text-[#166534]", bg: "bg-[#dcfce7]" },
  visualizado: { label: "Visualizado", text: "text-[#1e40af]", bg: "bg-[#dbeafe]" },
  nao_visto: { label: "Não visto", text: "text-[#92400e]", bg: "bg-[#fef3c7]" },
}

export default function ListarRecomendacoesPage() {
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos")
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos")
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    let items = [...mockRecomendacoes]
    if (filtroTipo !== "todos") items = items.filter((r) => r.servico.tipo === filtroTipo)
    if (filtroStatus !== "todos") {
      items = items.filter((r) => {
        const v = r.visualizada ? "visualizado" : "nao_visto"
        return filtroStatus === "aceite" ? r.aceite : v === filtroStatus
      })
    }
    return items
  }, [filtroTipo, filtroStatus])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const pageItems = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE)

  return (
    <div className="p-10 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[32px] font-semibold text-[#00163c] -tracking-[0.32px]">Todas as Recomendações</h1>
        <p className="text-[#44474f] text-base">Lista completa de recomendações geradas para o seu perfil.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {(["todos", "credito", "seguro"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFiltroTipo(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all cursor-pointer ${
                filtroTipo === t ? "bg-[#00163c] text-white" : "bg-[#e2e8f8] text-[#44474f] hover:bg-[#e2e8f8]/80"
              }`}
            >
              {t === "todos" ? "Todos" : t === "credito" ? "Crédito" : "Seguros"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(["todos", "aceite", "visualizado", "nao_visto"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFiltroStatus(s)}
              className={`rounded-lg px-3 py-1.5 text-xs transition-all cursor-pointer ${
                filtroStatus === s
                  ? "bg-[#00163c]/5 text-[#00163c] border border-[#00163c]"
                  : "text-[#44474f] border border-[#c4c6d0] hover:bg-[#f0f3ff]"
              }`}
            >
              {s === "todos" ? "Todos" : s === "aceite" ? "Aceites" : s === "visualizado" ? "Visualizados" : "Não vistos"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-[#c4c6d0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f0f3ff] border-b border-[#c4c6d0]">
              {["SERVIÇO", "PROVEDOR", "TIPO", "ADEQUAÇÃO", "ESTADO", "ACÇÕES"].map((h) => (
                <th key={h} className="text-left text-[#44474f] text-sm font-medium tracking-[0.7px] px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((rec, i) => (
              <tr key={rec.id} className={i > 0 ? "border-t border-[#c4c6d0]" : ""}>
                <td className="px-6 py-4"><span className="text-[#151c27] text-base">{rec.servico.nome}</span></td>
                <td className="px-6 py-4"><span className="text-[#44474f] text-sm">{rec.servico.provedor_nome}</span></td>
                <td className="px-6 py-4">
                  <span className={`${rec.servico.tipo === "credito" ? "bg-[#0f2b5b] text-[#afc6ff]" : "bg-[#2b2b40] text-[#9392ab]"} text-[10px] font-bold tracking-[1px] rounded px-2 py-1`}>
                    {rec.servico.tipo === "credito" ? "CRÉDITO" : "SEGURO"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-[#dce2f3]">
                      <div className={`h-full rounded-full ${rec.probabilidade_adequacao * 100 >= 70 ? "bg-[#16a34a]" : rec.probabilidade_adequacao * 100 >= 40 ? "bg-[#feae2c]" : "bg-[#ba1a1a]"}`} style={{ width: `${rec.probabilidade_adequacao * 100}%` }} />
                    </div>
                    <span className="text-[#151c27] text-xs">{Math.round(rec.probabilidade_adequacao * 100)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`${rec.aceite ? statusMap.aceite.bg + " " + statusMap.aceite.text : rec.visualizada ? statusMap.visualizado.bg + " " + statusMap.visualizado.text : statusMap.nao_visto.bg + " " + statusMap.nao_visto.text} text-[11px] font-bold rounded-full px-3 py-1`}>
                    {rec.aceite ? "Aceite" : rec.visualizada ? "Visualizado" : "Não visto"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/recomendacoes/${rec.id}`}
                    className="flex items-center gap-1 text-[#00163c] text-sm hover:underline"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#c4c6d0] px-6 py-4">
            <p className="text-[#44474f] text-sm">Mostrando {pageItems.length} de {filtered.length} recomendações</p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#c4c6d0] hover:bg-[#f0f3ff] disabled:opacity-40 cursor-pointer">
                <ChevronLeft className="w-4 h-4 text-[#44474f]" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} type="button" onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs cursor-pointer ${p === safePage ? "bg-[#00163c] text-white" : "border border-[#c4c6d0] text-[#44474f] hover:bg-[#f0f3ff]"}`}>
                  {p}
                </button>
              ))}
              <button type="button" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#c4c6d0] hover:bg-[#f0f3ff] disabled:opacity-40 cursor-pointer">
                <ChevronRight className="w-4 h-4 text-[#44474f]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
