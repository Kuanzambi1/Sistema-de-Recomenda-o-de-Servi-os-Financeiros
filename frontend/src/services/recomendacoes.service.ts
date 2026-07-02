import api from "@/lib/axios";
import { Recomendacao } from "@/types";

export const recomendacoesService = {
  list: async (params?: { tipo?: string; sort?: string }): Promise<Recomendacao[]> => {
    const { data } = await api.get<Recomendacao[]>("/recomendacoes", { params });
    return data;
  },

  marcarInteresse: async (id: string): Promise<void> => {
    await api.patch(`/recomendacoes/${id}/interesse`);
  },
};
