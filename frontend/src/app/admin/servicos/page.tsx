"use client"

import { useState } from "react"
import AdminTable from "@/components/shared/AdminTable"
import type { AdminColumn } from "@/components/shared/AdminTable"
import PageHeader from "@/components/shared/PageHeader"
import {
  Clock,
  Briefcase,
  AlertTriangle,
  TrendingUp,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
} from "lucide-react"

const stats = [
  { label: "PENDENTES", value: "24", change: "+12%", changeUp: true, icon: Clock, iconBg: "bg-[#0f2b5b1a]", iconColor: "text-[#00163c]" },
  { label: "SERVIÇOS ACTIVOS", value: "148", change: "+8%", changeUp: true, icon: Briefcase, iconBg: "bg-[#feae2c1a]", iconColor: "text-[#835500]" },
  { label: "SINALIZADOS", value: "07", change: "-2%", changeUp: false, icon: AlertTriangle, iconBg: "bg-[#ffdad6]", iconColor: "text-[#ba1a1a]" },
  { label: "NOVOS REGISTOS", value: "32", change: "+12%", changeUp: true, icon: TrendingUp, iconBg: "bg-[#2b2b401a]", iconColor: "text-[#16162a]" },
]

interface ServicoRow {
  name: string
  id: string
  provider: string
  category: string
  status: { label: string; dot: string; text: string; bg: string }
  submitted: string
  actions: string
}

const services: ServicoRow[] = [
  { name: "Kwanza Corporate Credit", id: "SRF-9921", provider: "Banco Millennium Atlântico", category: "Crédito", status: { label: "Pendente", dot: "bg-[#835500]", text: "text-[#835500]", bg: "bg-[#feae2c1a]" }, submitted: "24 Out, 2023", actions: "icons" },
  { name: "High-Yield Escrow", id: "SRF-8812", provider: "Standard Bank Angola", category: "Investimento", status: { label: "Activo", dot: "bg-[#22c55e]", text: "text-[#15803d]", bg: "bg-[#dcfce7]" }, submitted: "20 Out, 2023", actions: "view" },
  { name: "Offshore Flow-X", id: "SRF-7734", provider: "InterFin Solutions", category: "Tesouraria", status: { label: "Sinalizado", dot: "bg-[#ba1a1a]", text: "text-[#ba1a1a]", bg: "bg-[#ffdad633]" }, submitted: "18 Out, 2023", actions: "review" },
  { name: "Asset-Backed Factoring", id: "SRF-4451", provider: "Angola Global Invest", category: "Financiamento", status: { label: "Pendente", dot: "bg-[#835500]", text: "text-[#835500]", bg: "bg-[#feae2c1a]" }, submitted: "15 Out, 2023", actions: "icons" },
  { name: "Crédito à Produção", id: "SRF-3342", provider: "BAI", category: "Crédito", status: { label: "Activo", dot: "bg-[#22c55e]", text: "text-[#15803d]", bg: "bg-[#dcfce7]" }, submitted: "10 Out, 2023", actions: "icons" },
  { name: "Factoring Internacional", id: "SRF-2231", provider: "Standard Bank Angola", category: "Financiamento", status: { label: "Activo", dot: "bg-[#22c55e]", text: "text-[#15803d]", bg: "bg-[#dcfce7]" }, submitted: "05 Out, 2023", actions: "view" },
]

export default function ServicosPage() {
  const [page, setPage] = useState(1)

  const columns: AdminColumn<ServicoRow>[] = [
    {
      key: "nome",
      header: "NOME DO SERVIÇO",
      render: (svc) => (
        <div className="flex items-center gap-3">
          <div className="w-[26px] h-10 rounded-lg bg-[#0f2b5b1a] flex items-center justify-center shrink-0">
            <Briefcase className="w-[18px] h-4 text-[#00163c]" />
          </div>
          <div>
            <p className="text-[#00163c] text-sm leading-tight font-medium">{svc.name}</p>
            <p className="text-[#44474f] text-xs mt-0.5">ID: {svc.id}</p>
          </div>
        </div>
      ),
    },
    { key: "provider", header: "PROVEDOR", render: (svc) => <span className="text-[#151c27] text-sm">{svc.provider}</span> },
    {
      key: "category",
      header: "CATEGORIA",
      render: (svc) => (
        <span className="bg-[#e2e8f8] text-[#00163c] text-xs rounded px-2 py-1">{svc.category}</span>
      ),
    },
    {
      key: "status",
      header: "ESTADO",
      render: (svc) => (
        <span className={`${svc.status.bg} inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1`}>
          <span className={`w-2 h-2 rounded-full ${svc.status.dot}`} />
          <span className={svc.status.text}>{svc.status.label}</span>
        </span>
      ),
    },
    { key: "submitted", header: "SUBMISSÃO", render: (svc) => <span className="text-[#44474f] text-sm">{svc.submitted}</span> },
    {
      key: "acoes",
      header: "AÇÕES",
      headerClassName: "text-right",
      className: "text-right",
      render: (svc) => {
        if (svc.actions === "icons") {
          return (
            <div className="flex items-center justify-end gap-1">
              <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f0f3ff] transition-colors" title="Ver detalhes">
                <Eye className="w-4 h-4 text-[#44474f]" />
              </button>
              <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f0f3ff] transition-colors" title="Documentos">
                <FileText className="w-4 h-4 text-[#44474f]" />
              </button>
              <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f0f3ff] transition-colors" title="Mais ações">
                <MoreHorizontal className="w-4 h-4 text-[#44474f]" />
              </button>
            </div>
          )
        } else if (svc.actions === "view") {
          return (
            <button type="button" className="text-[#00163c] text-sm hover:underline">
              Ver Histórico
            </button>
          )
        }
        return (
          <button type="button" className="bg-[#ba1a1a] text-white text-xs rounded px-3 py-1.5 hover:bg-[#ba1a1a]/90 transition-colors">
            Rever Risco
          </button>
        )
      },
    },
  ]

  return (
    <div className="p-10 flex flex-col gap-8">
      <PageHeader
        title="Gestão de Serviços"
        description="Revise e gerencie os produtos financeiros das instituições registadas."
        actions={
          <button
            type="button"
            className="flex items-center gap-2 bg-[#835500] hover:bg-[#835500]/90 text-white text-base rounded-lg px-6 py-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Relatório
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 border border-[#c4c6d0] shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                {stat.change && (
                  <span className={`text-xs font-bold ${stat.changeUp ? "text-[#16a34a]" : "text-[#ba1a1a]"}`}>
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-[#44474f] text-sm font-medium tracking-[0.28px] mt-1">{stat.label}</p>
              <p className="font-heading text-[32px] font-bold text-[#00163c] -tracking-[0.96px] leading-none">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <AdminTable
        columns={columns}
        data={services}
        keyExtractor={(s) => s.id}
        total={24}
        page={page}
        perPage={10}
        onPageChange={setPage}
        emptyMessage="Nenhum serviço encontrado."
      />
    </div>
  )
}
