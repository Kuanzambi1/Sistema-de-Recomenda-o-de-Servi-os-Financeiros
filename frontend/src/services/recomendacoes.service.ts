import api from "@/lib/axios"
import type { Recomendacao, RecomendacoesQuery, HistoricoQuery, PaginatedResponse } from "@/types"

export const recomendacoesService = {
  listar: async (params?: RecomendacoesQuery): Promise<PaginatedResponse<Recomendacao>> => {
    const { data } = await api.get<PaginatedResponse<Recomendacao>>("/recomendacoes", { params })
    return data
  },

  obter: async (id: string): Promise<Recomendacao> => {
    const { data } = await api.get<Recomendacao>(`/recomendacoes/${id}`)
    return data
  },

  historico: async (params?: HistoricoQuery): Promise<PaginatedResponse<Recomendacao>> => {
    const { data } = await api.get<PaginatedResponse<Recomendacao>>("/recomendacoes/historico", { params })
    return data
  },

  visualizar: async (id: string): Promise<void> => {
    await api.patch(`/recomendacoes/${id}/visualizar`)
  },

  aceitar: async (id: string): Promise<Recomendacao> => {
    const { data } = await api.patch<Recomendacao>(`/recomendacoes/${id}/aceitar`)
    return data
  },
}
