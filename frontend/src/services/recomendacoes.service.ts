import api from "@/lib/axios";
import { Recomendacao } from "@/types";

export const recomendacoesService = {
  listar: async (params?: { tipo?: string; sort?: string }): Promise<Recomendacao[]> => {
    const { data } = await api.get<any>("/recomendacoes", { params });
    return data.recomendacoes;
  },

  gerar: async (payload?: { montante_pretendido?: number }): Promise<void> => {
    await api.post("/recomendacoes", payload);
  },

  obter: async (id: string): Promise<Recomendacao> => {
    const { data } = await api.get<any>(`/recomendacoes/${id}`);
    return data.recomendacao;
  },

  decidir: async (id: string, aceite: boolean): Promise<void> => {
    await api.patch(`/recomendacoes/${id}/decisao`, { aceite });
  },

  marcarInteresse: async (id: string): Promise<void> => {
    await api.patch(`/recomendacoes/${id}/decisao`, { aceite: true });
  },
};
