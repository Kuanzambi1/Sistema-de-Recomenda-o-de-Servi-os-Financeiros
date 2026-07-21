import type {
  RecomendacoesQuery,
  HistoricoQuery,
  ServicosQuery,
  UtilizadoresQuery,
  FeedbacksQuery,
} from "@/types"

export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  perfil: {
    me: ["perfil", "me"] as const,
  },
  recomendacoes: {
    all: (filters?: RecomendacoesQuery) => ["recomendacoes", filters] as const,
    detail: (id: string) => ["recomendacoes", id] as const,
    historico: (filters?: HistoricoQuery) =>
      ["recomendacoes", "historico", filters] as const,
  },
  servicos: {
    all: (filters?: ServicosQuery) => ["servicos", filters] as const,
    detail: (id: string) => ["servicos", id] as const,
  },
  admin: {
    dashboard: ["admin", "dashboard"] as const,
    utilizadores: (filters?: UtilizadoresQuery) =>
      ["admin", "utilizadores", filters] as const,
    provedores: (filters?: Record<string, string>) =>
      ["admin", "provedores", filters] as const,
    servicos: (filters?: ServicosQuery) =>
      ["admin", "servicos", filters] as const,
    feedbacks: (filters?: FeedbacksQuery) =>
      ["admin", "feedbacks", filters] as const,
  },
  feedbacks: {
    all: (filters?: FeedbacksQuery) => ["feedbacks", filters] as const,
  },
}
