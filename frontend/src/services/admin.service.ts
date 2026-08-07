import api from "@/lib/axios";

export const adminService = {
  metricas: async (): Promise<any> => {
    const { data } = await api.get("/admin/metricas");
    return data;
  },
  listarUtilizadores: async (tipo?: string): Promise<any> => {
    const params = tipo && tipo !== "todos" ? { tipo } : {};
    const { data } = await api.get("/admin/utilizadores", { params });
    return data.utilizadores;
  },
  historicoModelos: async (): Promise<any> => {
    const { data } = await api.get("/admin/modelo/historico");
    return data;
  },
  criarUtilizador: async (payload: any): Promise<any> => {
    const { data } = await api.post("/admin/utilizadores", payload);
    return data;
  }
};
