"use client";

import { useState } from "react"
import AdminTable from "@/components/shared/AdminTable"
import type { AdminColumn } from "@/components/shared/AdminTable"
import PageHeader from "@/components/shared/PageHeader"
import {
  TrendingUp,
  Download,
  MoreHorizontal,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const kpiData = [
  {
    label: "Total de Utilizadores",
    value: "142,503",
    change: "+12.4%",
    changeUp: true,
    iconBg: "bg-[#0f2b5b1a]",
    icon: TrendingUp,
  },
  {
    label: "Instituições Financeiras",
    value: "28",
    iconBg: "bg-[#feae2c1a]",
    icon: TrendingUp,
  },
  {
    label: "Recomendações (Mês)",
    value: "894,221",
    change: "+8.2%",
    changeUp: true,
    iconBg: "bg-[#2b2b401a]",
    icon: TrendingUp,
  },
  {
    label: "Taxa de Aceitação",
    value: "64.8%",
    iconBg: "bg-[#0f2b5b1a]",
    icon: TrendingUp,
  },
];

const chartData = [
  { day: "SEG", consultas: 140, conversoes: 100 },
  { day: "TER", consultas: 110, conversoes: 80 },
  { day: "QUA", consultas: 160, conversoes: 50 },
  { day: "QUI", consultas: 90, conversoes: 130 },
  { day: "SEX", consultas: 130, conversoes: 110 },
  { day: "SAB", consultas: 70, conversoes: 40 },
  { day: "DOM", consultas: 50, conversoes: 30 },
];

// Inline tableData defined inside component scope above

interface InstituicaoRow {
  initials: string
  bgColor: string
  textColor: string
  name: string
  location: string
  date: string
  services: string
  status: { label: string; color: string; bg: string }
}

const tableData: InstituicaoRow[] = [
  { initials: "B", bgColor: "bg-[#0f2b5b1a]", textColor: "text-[#00163c]", name: "BAI - Banco Angolano de Investimentos", location: "Sede: Luanda", date: "12 Mai, 2024", services: "14 Serviços", status: { label: "Activo", color: "text-[#15803d]", bg: "bg-[#dcfce7]" } },
  { initials: "S", bgColor: "bg-[#feae2c1a]", textColor: "text-[#835500]", name: "Standard Bank Angola", location: "Sede: Talatona", date: "08 Mai, 2024", services: "09 Serviços", status: { label: "Activo", color: "text-[#15803d]", bg: "bg-[#dcfce7]" } },
  { initials: "B", bgColor: "bg-[#2b2b401a]", textColor: "text-[#16162a]", name: "BFA - Banco de Fomento Angola", location: "Sede: Belas", date: "05 Mai, 2024", services: "22 Serviços", status: { label: "Pendente", color: "text-[#b45309]", bg: "bg-[#fef3c7]" } },
]

export default function AdminDashboardPage() {
  const handleExportCSV = () => {
    // TODO: implementar exportação de relatório CSV
    console.log("Exportar CSV")
  }

  const handleFilterPeriod = () => {
    // TODO: abrir seletor de período
    console.log("Alterar período")
  }

  const handleViewLogs = () => {
    // TODO: redirecionar para /auditoria
    console.log("Ver logs detalhados")
  }

  const handleViewAllInstitutions = () => {
    window.location.href = "/admin/provedores"
  }

  const handleKPIClick = (label: string) => {
    // TODO: navegar para a página detalhada da métrica
    console.log("KPI clicado:", label)
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <PageHeader
        title="Dashboard Geral"
        description="Bem-vindo de volta. Aqui está o estado atual da plataforma SRF Angola."
        actions={
          <>
            <button
              type="button"
              onClick={handleFilterPeriod}
              className="flex items-center gap-1 bg-[#dce2f3] hover:bg-[#dce2f3]/80 text-[#00163c] text-base rounded-lg px-4 py-2 transition-colors cursor-pointer"
            >
              <TrendingUp className="w-[13.5px] h-[15px]" />
              Últimos 30 dias
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1 bg-[#835500] hover:bg-[#835500]/90 text-white text-base rounded-lg px-4 py-2 shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3 h-3" />
              Exportar CSV
            </button>
          </>
        }
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <button
            key={kpi.label}
            type="button"
            onClick={() => handleKPIClick(kpi.label)}
            className="bg-white rounded-xl p-6 border border-[#c4c6d04d] shadow-sm flex flex-col gap-2 text-left transition-all hover:shadow-md hover:border-[#c4c6d0] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5 text-[#00163c]" />
              </div>
              {kpi.change && (
                <span className="text-[#16a34a] text-xs font-normal bg-[#16a34a1a] rounded-full px-2 py-0.5">
                  {kpi.change}
                </span>
              )}
            </div>
            <div>
              <p className="text-[#44474f] text-sm font-medium tracking-[0.28px]">
                {kpi.label}
              </p>
              <p className="font-heading text-2xl font-bold text-[#00163c] mt-1">
                {kpi.value}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Middle Section: Activity & Health */}
      <div className="flex gap-6">
        {/* Activity Chart */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-[#c4c6d04d] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-heading text-base font-bold text-[#00163c]">
              Atividade da Plataforma
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00163c]" />
                <span className="text-[#44474f] text-xs">Consultas</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#835500]" />
                <span className="text-[#44474f] text-xs">Conversões</span>
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c4c6d080" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#44474f" }}
                  axisLine={{ stroke: "#c4c6d080" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#44474f" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #c4c6d0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "13px",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px", color: "#44474f" }}
                />
                <Bar dataKey="consultas" name="Consultas" fill="#00163c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversoes" name="Conversões" fill="#835500" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health Widget */}
        <div className="w-[304px] shrink-0 bg-white rounded-xl p-6 border border-[#c4c6d04d] shadow-sm flex flex-col gap-6">
          <h3 className="text-[#00163c] text-base border-b border-[#c4c6d0] pb-4">
            Estado do Sistema
          </h3>
          <div className="flex flex-col gap-4">
            <HealthRow
              dotColor="bg-[#22c55e]"
              label="Core API"
              value="99.98% uptime"
            />
            <HealthRow
              dotColor="bg-[#22c55e]"
              label="Base de Dados (Oracle)"
              value="Latência 12ms"
            />
            <HealthRow
              dotColor="bg-[#f59e0b]"
              label="Módulo de IA (Credit Score)"
              value="Carga Elevada"
            />
          </div>
          <div className="bg-[#f0f3ff] rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[#00163c] text-sm font-bold">Carga do Servidor</span>
              <span className="text-[#44474f] text-sm">42%</span>
            </div>
            <div className="h-2 rounded-full bg-[#c4c6d04d] overflow-hidden">
              <div className="h-full rounded-full bg-[#00163c]" style={{ width: "42%" }} />
            </div>
          </div>
          <button
            type="button"
            onClick={handleViewLogs}
            className="w-full text-center text-[#00163c] text-base py-2 rounded-lg border border-[#747780] hover:bg-[#f0f3ff] transition-colors cursor-pointer"
          >
            Ver Logs Detalhados
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#c4c6d04d] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c4c6d04d]">
          <h3 className="font-heading text-base font-bold text-[#00163c]">
            Instituições Recentemente Registadas
          </h3>
          <button
            type="button"
            onClick={handleViewAllInstitutions}
            className="text-[#00163c] text-base hover:text-[#00163c]/70 transition-colors cursor-pointer"
          >
            Ver todas
          </button>
        </div>
        <InstituicoesTable />
      </div>
    </div>
  );
}

const handleRowAction = (name: string) => {
  console.log("Ações para:", name)
}

const instituicoesColumns: AdminColumn<InstituicaoRow>[] = [
  {
    key: "instituicao",
    header: "INSTITUIÇÃO",
    render: (row) => (
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full ${row.bgColor} flex items-center justify-center shrink-0`}>
          <span className={`${row.textColor} text-base font-bold`}>{row.initials}</span>
        </div>
        <div>
          <p className="text-[#151c27] text-base font-bold leading-tight">{row.name}</p>
          <p className="text-[#44474f] text-sm">{row.location}</p>
        </div>
      </div>
    ),
  },
  { key: "data", header: "DATA DE ADESÃO", render: (row) => <span className="text-[#151c27] text-base">{row.date}</span> },
  { key: "servicos", header: "SERVIÇOS ACTIVOS", render: (row) => <span className="text-[#151c27] text-base">{row.services}</span> },
  {
    key: "estado",
    header: "ESTADO",
    render: (row) => (
      <span className={`${row.status.bg} ${row.status.color} text-xs font-bold rounded-full px-2 py-1`}>
        {row.status.label}
      </span>
    ),
  },
  {
    key: "acoes",
    header: "AÇÕES",
    headerClassName: "text-right",
    className: "text-right",
    render: (row) => (
      <button type="button" onClick={() => handleRowAction(row.name)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f0f3ff] transition-colors cursor-pointer" title="Mais ações">
        <MoreHorizontal className="w-4 h-4 text-[#44474f]" />
      </button>
    ),
  },
]

function InstituicoesTable() {
  const [page, setPage] = useState(1)
  return (
    <AdminTable
      columns={instituicoesColumns}
      data={tableData}
      keyExtractor={(r) => r.name}
      total={tableData.length}
      page={page}
      perPage={5}
      onPageChange={setPage}
      emptyMessage="Nenhuma instituição encontrada."
    />
  )
}

function HealthRow({
  dotColor,
  label,
  value,
}: {
  dotColor: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className="text-[#151c27] text-base">{label}</span>
      </div>
      <span className="text-[#44474f] text-sm">{value}</span>
    </div>
  );
}
