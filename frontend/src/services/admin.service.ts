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
  retreinar: async (): Promise<any> => {
    const { data } = await api.post("/admin/modelo/retreinar");
    return data;
  },
  criarUtilizador: async (payload: any): Promise<any> => {
    const { data } = await api.post("/admin/utilizadores", payload);
    return data;
  },
  alternarAtivo: async (id: string, ativo: boolean): Promise<any> => {
    const { data } = await api.patch(`/admin/utilizadores/${id}/ativo`, { ativo });
    return data;
  },
  obterUtilizador: async (id: string): Promise<any> => {
    const { data } = await api.get(`/admin/utilizadores/${id}`);
    return data.utilizador;
  },
  actualizarUtilizador: async (id: string, payload: any): Promise<any> => {
    const { data } = await api.put(`/admin/utilizadores/${id}`, payload);
    return data;
  },
  eliminarUtilizador: async (id: string): Promise<any> => {
    const { data } = await api.delete(`/admin/utilizadores/${id}`);
    return data;
  },

  listarServicos: async (params?: any): Promise<any> => {
    const { data } = await api.get("/admin/servicos", { params });
    return data;
  },
  aplicarEstadoServico: async (id: string, estado: string): Promise<any> => {
    const { data } = await api.patch(`/admin/servicos/${id}/estado`, { estado });
    return data;
  },
  listarAuditoria: async (): Promise<any> => {
    const { data } = await api.get("/admin/auditoria");
    return data;
  },
  obterRisco: async (): Promise<any> => {
    const { data } = await api.get("/admin/risco");
    return data.config;
  },
  actualizarRisco: async (payload: any): Promise<any> => {
    const { data } = await api.put("/admin/risco", payload);
    return data.config;
  },
};
