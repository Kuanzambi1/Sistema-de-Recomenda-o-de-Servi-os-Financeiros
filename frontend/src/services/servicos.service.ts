import api from "@/lib/axios";
import { ServicoFinanceiro, ServicoFinanceiroPayload, PaginatedResponse } from "@/types";

export const servicosService = {
  listar: async (params?: any): Promise<{ servicos: ServicoFinanceiro[]; paginacao: any }> => {
    const { data } = await api.get<{ servicos: ServicoFinanceiro[]; paginacao: any }>("/servicos", { params });
    return data;
  },
  
  obter: async (id: string): Promise<ServicoFinanceiro> => {
    const { data } = await api.get<any>(`/servicos/${id}`);
    return data.servico;
  },

  criar: async (payload: ServicoFinanceiroPayload): Promise<ServicoFinanceiro> => {
    const { data } = await api.post<any>("/servicos", payload);
    return data.servico;
  },

  actualizar: async (id: string, payload: Partial<ServicoFinanceiroPayload>): Promise<ServicoFinanceiro> => {
    const { data } = await api.put<any>(`/servicos/${id}`, payload);
    return data.servico;
  }
};
