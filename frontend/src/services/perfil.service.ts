import api from "@/lib/axios";
import { PerfilFinanceiro, PerfilFinanceiroPayload } from "@/types";

export const perfilService = {
  create: async (payload: PerfilFinanceiroPayload): Promise<PerfilFinanceiro> => {
    const { data } = await api.post<PerfilFinanceiro>("/perfil-financeiro", payload);
    return data;
  },
};
