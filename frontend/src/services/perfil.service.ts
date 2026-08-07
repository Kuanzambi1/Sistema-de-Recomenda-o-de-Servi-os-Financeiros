import api from "@/lib/axios";
import { PerfilFinanceiro, PerfilFinanceiroPayload } from "@/types";

export const perfilService = {
  obter: async (): Promise<PerfilFinanceiro> => {
    const { data } = await api.get<any>("/perfil");
    return data.perfil;
  },
  criar: async (payload: PerfilFinanceiroPayload): Promise<PerfilFinanceiro> => {
    const { data } = await api.post<any>("/perfil", payload);
    return data.perfil;
  },
  atualizar: async (payload: Partial<PerfilFinanceiroPayload>): Promise<PerfilFinanceiro> => {
    const { data } = await api.put<any>("/perfil", payload);
    return data.perfil;
  },
};
