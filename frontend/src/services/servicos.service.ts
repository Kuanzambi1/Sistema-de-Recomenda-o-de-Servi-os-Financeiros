import api from "@/lib/axios"
import type {
  ServicoFinanceiro,
  ServicoFinanceiroPayload,
  ServicosQuery,
  PaginatedResponse,
} from "@/types"

export const servicosService = {
  listar: async (params?: ServicosQuery): Promise<PaginatedResponse<ServicoFinanceiro>> => {
    const { data } = await api.get<PaginatedResponse<ServicoFinanceiro>>("/servicos", { params })
    return data
  },

  obter: async (id: string): Promise<ServicoFinanceiro> => {
    const { data } = await api.get<ServicoFinanceiro>(`/servicos/${id}`)
    return data
  },

  criar: async (payload: ServicoFinanceiroPayload): Promise<ServicoFinanceiro> => {
    const { data } = await api.post<ServicoFinanceiro>("/servicos", payload)
    return data
  },

  atualizar: async (id: string, payload: Partial<ServicoFinanceiroPayload>): Promise<ServicoFinanceiro> => {
    const { data } = await api.put<ServicoFinanceiro>(`/servicos/${id}`, payload)
    return data
  },

  toggleAtivo: async (id: string): Promise<ServicoFinanceiro> => {
    const { data } = await api.patch<ServicoFinanceiro>(`/servicos/${id}/toggle`)
    return data
  },

  remover: async (id: string): Promise<void> => {
    await api.delete(`/servicos/${id}`)
  },
}
