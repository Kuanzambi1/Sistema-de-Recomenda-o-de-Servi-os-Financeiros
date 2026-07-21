import api from "@/lib/axios"
import type {
  DashboardResponse,
  PaginatedResponse,
  Utilizador,
  Provedor,
  ServicoFinanceiro,
  UtilizadoresQuery,
  FeedbacksQuery,
  Feedback,
} from "@/types"

export const adminService = {
  dashboard: async (): Promise<DashboardResponse> => {
    const { data } = await api.get<DashboardResponse>("/admin/dashboard")
    return data
  },

  listarUtilizadores: async (params?: UtilizadoresQuery): Promise<PaginatedResponse<Utilizador>> => {
    const { data } = await api.get<PaginatedResponse<Utilizador>>("/admin/utilizadores", { params })
    return data
  },

  toggleUtilizador: async (id: string): Promise<Utilizador> => {
    const { data } = await api.patch<Utilizador>(`/admin/utilizadores/${id}/toggle`)
    return data
  },

  listarProvedores: async (params?: Record<string, string>): Promise<PaginatedResponse<Provedor>> => {
    const { data } = await api.get<PaginatedResponse<Provedor>>("/admin/provedores", { params })
    return data
  },

  criarProvedor: async (payload: { nome_empresa: string; email: string; password: string }): Promise<Provedor> => {
    const { data } = await api.post<Provedor>("/admin/provedores", payload)
    return data
  },

  listarServicos: async (params?: Record<string, string>): Promise<PaginatedResponse<ServicoFinanceiro>> => {
    const { data } = await api.get<PaginatedResponse<ServicoFinanceiro>>("/admin/servicos", { params })
    return data
  },

  listarFeedbacks: async (params?: FeedbacksQuery): Promise<PaginatedResponse<Feedback> & { stats: { media_geral: number; total: number; percent_util: number; distribuicao: Record<string, number> } }> => {
    const { data } = await api.get("/admin/feedbacks", { params })
    return data
  },
}
