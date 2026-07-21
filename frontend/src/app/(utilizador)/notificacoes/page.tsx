"use client"

import { useState } from "react"
import {
  Bell,
  CheckCheck,
  CreditCard,
  Shield,
  TrendingUp,
  Info,
  Trash2,
} from "lucide-react"

interface Notificacao {
  id: string
  titulo: string
  mensagem: string
  tipo: "recomendacao" | "seguranca" | "info" | "promocao"
  lida: boolean
  criado_em: string
}

const mockNotificacoes: Notificacao[] = [
  { id: "n1", titulo: "Nova recomendação disponível", mensagem: "O sistema encontrou um novo crédito pessoal adequado ao seu perfil.", tipo: "recomendacao", lida: false, criado_em: "Hoje, 14:30" },
  { id: "n2", titulo: "Alteração de password", mensagem: "A sua password foi alterada com sucesso.", tipo: "seguranca", lida: false, criado_em: "Hoje, 10:15" },
  { id: "n3", titulo: "Recomendação aceite", mensagem: "O seu pedido de crédito foi registado. A instituição irá contactá-lo em breve.", tipo: "recomendacao", lida: true, criado_em: "Ontem, 16:45" },
  { id: "n4", titulo: "Actualização do perfil financeiro", mensagem: "Complete o seu perfil financeiro para recomendações mais precisas.", tipo: "info", lida: true, criado_em: "12 Jul, 2025" },
  { id: "n5", titulo: "Novo seguro disponível", mensagem: "O BIC lançou um novo seguro de vida com condições especiais.", tipo: "recomendacao", lida: false, criado_em: "10 Jul, 2025" },
  { id: "n6", titulo: "Score de crédito actualizado", mensagem: "O seu score de crédito foi actualizado para 680 pontos.", tipo: "info", lida: true, criado_em: "08 Jul, 2025" },
]

const tipoIcon: Record<string, typeof Bell> = {
  recomendacao: TrendingUp,
  seguranca: Shield,
  info: Info,
  promocao: CreditCard,
}

const tipoColors: Record<string, string> = {
  recomendacao: "bg-blue-100 text-blue-600",
  seguranca: "bg-amber-100 text-amber-600",
  info: "bg-gray-100 text-gray-600",
  promocao: "bg-green-100 text-green-600",
}

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] = useState(mockNotificacoes)
  const [filtro, setFiltro] = useState<"todas" | "nao_lidas">("todas")

  const filtered = filtro === "nao_lidas" ? notificacoes.filter((n) => !n.lida) : notificacoes
  const naoLidas = notificacoes.filter((n) => !n.lida).length

  const marcarLidas = () => {
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })))
  }

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[896px] mx-auto w-full">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[32px] font-bold text-primary">Notificações</h1>
          <p className="text-muted-foreground text-base">
            {naoLidas > 0 ? `Tem ${naoLidas} notificação(ões) por ler.` : "Todas as notificações estão lidas."}
          </p>
        </div>
        {naoLidas > 0 && (
          <button
            type="button"
            onClick={marcarLidas}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {(["todas", "nao_lidas"] as const).map((tipo) => (
          <button
            key={tipo}
            type="button"
            onClick={() => setFiltro(tipo)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filtro === tipo
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {tipo === "todas" ? "Todas" : `Não lidas (${naoLidas})`}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Bell className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-lg font-medium">Nenhuma notificação</p>
            <p className="text-sm">Volte mais tarde para novas actualizações.</p>
          </div>
        ) : (
          filtered.map((n) => {
            const Icon = tipoIcon[n.tipo] || Bell
            const colorClass = tipoColors[n.tipo] || "bg-gray-100 text-gray-600"
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-5 rounded-xl border transition-all ${
                  n.lida
                    ? "bg-card border-border"
                    : "bg-primary/[0.03] border-primary/20 shadow-sm"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${n.lida ? "text-muted-foreground" : "text-foreground"}`}>
                      {n.titulo}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      {!n.lida && <span className="w-2 h-2 rounded-full bg-primary" />}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{n.criado_em}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{n.mensagem}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
