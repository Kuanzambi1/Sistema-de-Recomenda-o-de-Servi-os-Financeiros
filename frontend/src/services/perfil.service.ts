import api from "@/lib/axios"
import type { PerfilFinanceiro, PerfilFinanceiroPayload } from "@/types"

export const perfilService = {
  obter: async (): Promise<PerfilFinanceiro> => {
    const { data } = await api.get<PerfilFinanceiro>("/perfil-financeiro/me")
    return data
  },

  create: async (payload: PerfilFinanceiroPayload): Promise<PerfilFinanceiro> => {
    const { data } = await api.post<PerfilFinanceiro>("/perfil-financeiro", payload)
    return data
  },

  atualizar: async (payload: PerfilFinanceiroPayload): Promise<PerfilFinanceiro> => {
    const { data } = await api.put<PerfilFinanceiro>("/perfil-financeiro", payload)
    return data
  },
}
