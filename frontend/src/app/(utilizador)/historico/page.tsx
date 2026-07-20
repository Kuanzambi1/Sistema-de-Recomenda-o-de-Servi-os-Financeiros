<<<<<<< HEAD
"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, ChevronRight, Loader2 } from "lucide-react";
import { recomendacoesService } from "@/services/recomendacoes.service";

const statusMap: Record<string, { icon: React.ElementType; label: string; color: string; bg: string; dot: string }> = {
  accepted: { icon: CheckCircle2, label: "Aceite", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400" },
  rejected: { icon: XCircle, label: "Rejeitado", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", dot: "bg-red-400/50" },
  pending:  { icon: Clock, label: "Pendente", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", dot: "bg-amber-400" },
};

function getStatus(rec: any) {
  if (rec.aceite === true) return "accepted";
  if (rec.aceite === false) return "rejected";
  return "pending";
}

export default function HistoricoPage() {
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    (async () => {
      try {
        const data = await recomendacoesService.listar();
        setRecs(data);
      } catch {
        // silently fallback to empty
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = recs.filter((r) => {
    if (filter === "Todos") return true;
    const s = getStatus(r);
    if (filter === "Aceite") return s === "accepted";
    if (filter === "Rejeitado") return s === "rejected";
    if (filter === "Pendente") return s === "pending";
    return true;
  });

  return (
    <div className="flex flex-col gap-8 p-6 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">Histórico de Recomendações</h1>
        <p className="text-muted-foreground mt-1 text-sm">Acompanhe o estado dos serviços financeiros recomendados.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["Todos", "Aceite", "Pendente", "Rejeitado"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f
                ? "bg-primary/15 border-primary/30 text-primary"
                : "bg-white/5 border-border text-muted-foreground hover:bg-white/10 hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Clock className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-1">Sem registos</h2>
          <p className="text-muted-foreground text-sm">Nenhuma recomendação encontrada com este filtro.</p>
        </div>
      )}

      {/* Timeline */}
      {!loading && filtered.length > 0 && (
        <div className="relative flex flex-col">
          <div className="absolute left-[22px] top-6 bottom-6 w-px bg-border" />
          <div className="flex flex-col gap-6">
            {filtered.map((rec) => {
              const s = getStatus(rec);
              const st = statusMap[s];
              const StatusIcon = st.icon;

              return (
                <div key={rec.id} className="group flex items-start gap-5 relative">
                  <div className={`relative z-10 w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${st.bg} border-current ${st.color}`}>
                    <StatusIcon className="w-4.5 h-4.5" />
                    {s === "pending" && (
                      <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-between p-5 rounded-xl bg-card border border-border hover:border-white/15 hover:bg-card/80 transition-all cursor-pointer group-hover:shadow-lg group-hover:shadow-black/20">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                        {rec.nome_provedor}
                      </p>
                      <h3 className="text-base font-bold text-foreground mb-2">{rec.nome_servico}</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(rec.criado_em).toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {Math.round((rec.probabilidade_adequacao ?? 0) * 100)}% match
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.color}`}>
                        {st.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
=======
"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Calendar, Search, Eye } from "lucide-react"

type ProductType = "todos" | "credito" | "seguros"
type StatusFilter = "todos" | "aceites" | "visualizados" | "nao_vistos"

const historyRows = [
  {
    servico: "Crédito Pessoal Flexível",
    provedor: "Banco de Fomento de Angola",
    tipo: "CRÉDITO",
    tipoBg: "bg-[#0f2b5b]",
    tipoText: "text-[#afc6ff]",
    adequacao: 98,
    adequacaoColor: "bg-[#16a34a]",
    estado: { label: "Aceite", text: "text-[#166534]", bg: "bg-[#dcfce7]" },
    data: "24/10/2024",
  },
  {
    servico: "Seguro Saúde Premium Plus",
    provedor: "AAA Seguros",
    tipo: "SEGURO",
    tipoBg: "bg-[#2b2b40]",
    tipoText: "text-[#9392ab]",
    adequacao: 87,
    adequacaoColor: "bg-[#16a34a]",
    estado: { label: "Visualizado", text: "text-[#1e40af]", bg: "bg-[#dbeafe]" },
    data: "22/10/2024",
  },
  {
    servico: "Crédito Habitação Jovem",
    provedor: "Banco BIC",
    tipo: "CRÉDITO",
    tipoBg: "bg-[#0f2b5b]",
    tipoText: "text-[#afc6ff]",
    adequacao: 72,
    adequacaoColor: "bg-[#feae2c]",
    estado: { label: "Aceite", text: "text-[#166534]", bg: "bg-[#dcfce7]" },
    data: "15/10/2024",
  },
  {
    servico: "Seguro Automóvel Total",
    provedor: "ENSA Seguros",
    tipo: "SEGURO",
    tipoBg: "bg-[#2b2b40]",
    tipoText: "text-[#9392ab]",
    adequacao: 64,
    adequacaoColor: "bg-[#feae2c]",
    estado: { label: "Não visto", text: "text-[#92400e]", bg: "bg-[#fef3c7]" },
    data: "10/10/2024",
  },
  {
    servico: "Microcrédito Empreendedor",
    provedor: "Banco Sol",
    tipo: "CRÉDITO",
    tipoBg: "bg-[#0f2b5b]",
    tipoText: "text-[#afc6ff]",
    adequacao: 45,
    adequacaoColor: "bg-[#ba1a1a]",
    estado: { label: "Visualizado", text: "text-[#1e40af]", bg: "bg-[#dbeafe]" },
    data: "05/10/2024",
  },
]

const columns = [
  { key: "servico", label: "SERVIÇO", width: "w-[161px]" },
  { key: "provedor", label: "PROVEDOR", width: "w-[130px]" },
  { key: "tipo", label: "TIPO", width: "w-[114px]", center: true },
  { key: "adequacao", label: "ADEQUAÇÃO", width: "w-[192px]" },
  { key: "estado", label: "ESTADO", width: "w-[126px]", center: true },
  { key: "data", label: "DATA", width: "w-[124px]" },
  { key: "acoes", label: "ACÇÕES", width: "w-[130px]", right: true },
]

export default function HistoricoPage() {
  const [productType, setProductType] = useState<ProductType>("todos")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos")

  const filteredRows = historyRows.filter((row) => {
    if (productType !== "todos") {
      const productMap: Record<string, ProductType> = {
        CRÉDITO: "credito",
        SEGURO: "seguros",
      }
      if (productMap[row.tipo] !== productType) return false
    }
    if (statusFilter !== "todos") {
      const statusMap: Record<string, StatusFilter> = {
        Aceite: "aceites",
        Visualizado: "visualizados",
        "Não visto": "nao_vistos",
      }
      if (statusMap[row.estado.label] !== statusFilter) return false
    }
    return true
  })

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-[32px] font-semibold text-[#00163c] -tracking-[0.32px]">
          Histórico de Recomendações
        </h1>
        <p className="text-[#44474f] text-base">
          Gerencie e acompanhe o estado de todas as propostas financeiras enviadas.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-[#c4c6d0] p-6">
        <div className="flex gap-6">
          {/* Date Range Picker */}
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[#44474f] text-sm font-medium tracking-[0.28px]">Período</span>
            <div className="flex items-center gap-2 bg-[#f0f3ff] border border-[#c4c6d0] rounded-lg px-4 py-2">
              <Calendar className="w-[10px] h-[12px] text-[#44474f]" />
              <span className="text-[#6b7280] text-sm">De</span>
              <span className="text-[#c4c6d0] text-sm">|</span>
              <span className="text-[#6b7280] text-sm">Até</span>
            </div>
          </div>

          {/* Product Type Pills */}
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[#44474f] text-sm font-medium tracking-[0.28px]">Tipo de Produto</span>
            <div className="flex gap-2">
              {(["todos", "credito", "seguros"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setProductType(type)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                    productType === type
                      ? "bg-[#00163c] text-white"
                      : "bg-[#e2e8f8] text-[#44474f] hover:bg-[#e2e8f8]/80"
                  }`}
                >
                  {type === "todos" ? "Todos" : type === "credito" ? "Crédito" : "Seguros"}
                </button>
              ))}
            </div>
          </div>

          {/* Status Chips */}
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[#44474f] text-sm font-medium tracking-[0.28px]">Estado</span>
            <div className="flex flex-wrap gap-2">
              {(["todos", "aceites", "visualizados", "nao_vistos"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition-all cursor-pointer ${
                    statusFilter === st
                      ? "bg-[#00163c]/5 text-[#00163c] border border-[#00163c]"
                      : "text-[#44474f] border border-[#c4c6d0] hover:bg-[#f0f3ff]"
                  }`}
                >
                  {st === "todos" ? "Todos" : st === "aceites" ? "Aceites" : st === "visualizados" ? "Visualizados" : "Não vistos"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-[#c4c6d0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#f0f3ff] border-b border-[#c4c6d0]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`${col.width} ${col.center ? "text-center" : ""} ${
                    col.right ? "text-right" : "text-left"
                  } text-[#44474f] text-sm font-medium tracking-[0.7px] px-6 py-4`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, i) => (
              <tr
                key={row.servico + row.data}
                className={
                  i > 0 ? "border-t border-[#c4c6d0]" : ""
                }
              >
                <td className="px-6 py-4 align-top">
                  <span className="text-[#151c27] text-base leading-tight whitespace-pre-line">
                    {row.servico}
                  </span>
                </td>
                <td className="px-6 py-4 align-top">
                  <span className="text-[#151c27] text-sm leading-relaxed whitespace-pre-line">
                    {row.provedor}
                  </span>
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="flex justify-center">
                    <span
                      className={`${row.tipoBg} ${row.tipoText} text-[10px] font-bold tracking-[1px] rounded px-2 py-1`}
                    >
                      {row.tipo}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="flex flex-col gap-1 max-w-[144px]">
                    <span className="text-[#151c27] text-xs">{row.adequacao}%</span>
                    <div className="w-full h-1.5 rounded-full bg-[#dce2f3]">
                      <div
                        className={`h-full rounded-full ${row.adequacaoColor}`}
                        style={{ width: `${row.adequacao}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="flex justify-center">
                    <span
                      className={`${row.estado.bg} ${row.estado.text} text-[11px] font-bold rounded-full px-3 py-1`}
                    >
                      {row.estado.label}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 align-top">
                  <span className="text-[#44474f] text-sm">{row.data}</span>
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[#00163c] text-sm hover:underline cursor-pointer group"
                    >
                      <span className="group-hover:underline">Ver detalhes</span>
                      <ChevronRight className="w-3 h-2 text-[#00163c]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between bg-white border-t border-[#c4c6d0] px-6 py-4">
          <p className="text-[#44474f] text-sm">Mostrando {filteredRows.length} de 42 recomendações</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#c4c6d0] hover:bg-[#f0f3ff] cursor-pointer"
            >
              <ChevronLeft className="w-[4px] h-[7px] text-[#44474f]" />
            </button>
            <button
              type="button"
              className="bg-[#00163c] text-white text-xs rounded-lg px-3 h-8 flex items-center justify-center cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              className="border border-[#c4c6d0] text-[#44474f] text-xs rounded-lg px-3 h-8 flex items-center justify-center hover:bg-[#f0f3ff] cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="border border-[#c4c6d0] text-[#44474f] text-xs rounded-lg px-3 h-8 flex items-center justify-center hover:bg-[#f0f3ff] cursor-pointer"
            >
              3
            </button>
            <span className="text-[#c4c6d0] text-base px-1">...</span>
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#c4c6d0] hover:bg-[#f0f3ff] cursor-pointer"
            >
              <ChevronRight className="w-[4px] h-[7px] text-[#44474f]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
>>>>>>> d41cf1a (Save my changes before pull)
}
