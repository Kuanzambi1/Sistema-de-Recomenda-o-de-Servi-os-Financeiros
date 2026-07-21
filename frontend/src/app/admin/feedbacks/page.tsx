"use client"

import { useMemo, useState } from "react"
import AdminTable from "@/components/shared/AdminTable"
import type { AdminColumn } from "@/components/shared/AdminTable"
import PageHeader from "@/components/shared/PageHeader"
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Filter,
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
  Cell,
} from "recharts"

const LIKERT_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#15803d"]

interface FeedbackItem {
  id: string
  utilizador: string
  servico: string
  nota_likert: 1 | 2 | 3 | 4 | 5
  util: boolean
  comentario: string | null
  criado_em: string
}

const mockFeedbacks: FeedbackItem[] = Array.from({ length: 24 }, (_, i) => ({
  id: `fb-${i + 1}`,
  utilizador: ["Mateus Gonçalves", "Isabel dos Santos", "Ricardo Mendes", "Elena Kuame", "João Pedro", "Ana Silva"][i % 6],
  servico: ["Crédito Pessoal BIC", "Crédito Habitação", "Seguro de Vida BIC", "Seguro Automóvel", "Crédito Pessoal BAI"][i % 5],
  nota_likert: (Math.floor(Math.random() * 5) + 1) as 1 | 2 | 3 | 4 | 5,
  util: Math.random() > 0.3,
  comentario: Math.random() > 0.4
    ? ["Muito satisfeito com a recomendação.", "Boa experiência, mas gostaria de mais opções.", "Recomendação precisa e útil.", "Poderia incluir mais informações sobre taxas.", "Excelente serviço!"][i % 5]
    : null,
  criado_em: ["12 Jun, 2025", "10 Jun, 2025", "08 Jun, 2025", "05 Jun, 2025", "01 Jun, 2025", "28 Mai, 2025"][i % 6],
}))

const likertLabels: Record<number, string> = { 1: "Mau", 2: "Regular", 3: "Bom", 4: "Muito Bom", 5: "Excelente" }

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2)

const avatarColors = [
  "bg-[#0f2b5b1a] text-[#00163c]", "bg-[#feae2c1a] text-[#835500]",
  "bg-[#2b2b401a] text-[#16162a]", "bg-[#dce2f3] text-[#44474f]",
  "bg-[#ffdad61a] text-[#ba1a1a]", "bg-[#dcfce7] text-[#15803d]",
]

export default function FeedbacksPage() {
  const [search, _setSearch] = useState("")
  const [page, setPage] = useState(1)
  const perPage = 8

  const stats = useMemo(() => {
    const total = mockFeedbacks.length
    const avg = mockFeedbacks.reduce((s, f) => s + f.nota_likert, 0) / total
    const uteis = mockFeedbacks.filter((f) => f.util).length
    const comComentario = mockFeedbacks.filter((f) => f.comentario).length
    return { total, media: avg.toFixed(1), uteis, comComentario, taxaUtil: Math.round((uteis / total) * 100) }
  }, [])

  const distribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0]
    mockFeedbacks.forEach((f) => dist[f.nota_likert - 1]++)
    return dist.map((count, i) => ({
      nota: i + 1, label: likertLabels[i + 1], count,
      percent: ((count / mockFeedbacks.length) * 100).toFixed(0),
    }))
  }, [])

  const paginated = mockFeedbacks.slice((page - 1) * perPage, page * perPage)

  const columns: AdminColumn<FeedbackItem>[] = [
    {
      key: "utilizador",
      header: "UTILIZADOR",
      render: (fb, i) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center shrink-0 text-xs font-bold`}>
            {initials(fb.utilizador)}
          </div>
          <span className="text-[#151c27] text-sm">{fb.utilizador}</span>
        </div>
      ),
    },
    { key: "servico", header: "SERVIÇO", render: (fb) => <span className="text-[#44474f] text-sm">{fb.servico}</span> },
    {
      key: "classificacao",
      header: "CLASSIFICAÇÃO",
      render: (fb) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" style={{ fill: LIKERT_COLORS[fb.nota_likert - 1], color: LIKERT_COLORS[fb.nota_likert - 1] }} />
          <span className="text-sm font-medium text-[#151c27]">{fb.nota_likert}</span>
        </div>
      ),
    },
    {
      key: "util",
      header: "ÚTIL",
      render: (fb) =>
        fb.util ? (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#15803d] bg-[#dcfce7] rounded-full px-2 py-0.5">
            <ThumbsUp className="w-3 h-3" /> Sim
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#b91c1c] bg-[#fee2e2] rounded-full px-2 py-0.5">
            <ThumbsDown className="w-3 h-3" /> Não
          </span>
        ),
    },
    {
      key: "comentario",
      header: "COMENTÁRIO",
      render: (fb) => (
        <span className="text-[#44474f] text-sm max-w-[200px] block truncate">
          {fb.comentario || <span className="italic">—</span>}
        </span>
      ),
    },
    { key: "data", header: "DATA", render: (fb) => <span className="text-[#44474f] text-sm">{fb.criado_em}</span> },
    {
      key: "acoes",
      header: "AÇÕES",
      headerClassName: "text-right",
      className: "text-right",
      render: () => (
        <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f0f3ff] transition-colors" title="Mais ações">
          <MoreHorizontal className="w-4 h-4 text-[#44474f]" />
        </button>
      ),
    },
  ]

  return (
    <div className="p-10 flex flex-col gap-8">
      <PageHeader
        title="Feedbacks dos Utilizadores"
        description="Acompanhe o feedback dos utilizadores sobre as recomendações financeiras."
      />

      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Star, bg: "bg-[#0f2b5b1a]", iconColor: "text-[#00163c]", label: "Média Geral", value: stats.media },
          { icon: ThumbsUp, bg: "bg-[#feae2c1a]", iconColor: "text-[#835500]", label: "Taxa de Utilidade", value: `${stats.taxaUtil}%` },
          { icon: MessageSquare, bg: "bg-[#2b2b401a]", iconColor: "text-[#16162a]", label: "Com Comentário", value: String(stats.comComentario) },
          { icon: ThumbsUp, bg: "bg-[#dcfce7]", iconColor: "text-[#15803d]", label: "Feedbacks Úteis", value: String(stats.uteis) },
        ].map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-xl p-6 border border-[#c4c6d04d] shadow-sm flex flex-col gap-2">
              <div className={`w-12 h-12 rounded-lg ${card.bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <p className="text-[#44474f] text-sm font-medium tracking-[0.28px]">{card.label}</p>
              <p className="font-heading text-2xl font-bold text-[#00163c]">{card.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-2 bg-white rounded-xl border border-[#c4c6d04d] shadow-sm p-6">
          <h3 className="font-heading text-base font-bold text-[#00163c] mb-6">
            Distribuição de Classificações
          </h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribution} barSize={48} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c4c6d080" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#44474f" }} axisLine={{ stroke: "#c4c6d080" }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#44474f" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #c4c6d0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} cursor={{ fill: "#c4c6d020" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {distribution.map((entry, idx) => (
                    <Cell key={entry.nota} fill={LIKERT_COLORS[idx]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-3 bg-white rounded-xl border border-[#c4c6d04d] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#c4c6d04d]">
            <h3 className="font-heading text-base font-bold text-[#00163c]">Resumo por Classificação</h3>
          </div>
          <div className="divide-y divide-[#c4c6d04d]">
            {distribution.map((d) => (
              <div key={d.nota} className="flex items-center gap-4 px-6 py-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: LIKERT_COLORS[d.nota - 1] }}>
                  {d.nota}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#151c27]">{d.label}</span>
                    <span className="text-xs text-[#44474f]">{d.count} ({d.percent}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#c4c6d04d] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${d.percent}%`, backgroundColor: LIKERT_COLORS[d.nota - 1] }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-[#00163c]" />
        <span className="font-heading text-base font-bold text-[#00163c]">Feedbacks Recentes</span>
      </div>

      <AdminTable
        columns={columns}
        data={paginated}
        keyExtractor={(fb) => fb.id}
        total={mockFeedbacks.length}
        page={page}
        perPage={perPage}
        onPageChange={setPage}
        emptyMessage="Nenhum feedback encontrado."
      />
    </div>
  )
}
