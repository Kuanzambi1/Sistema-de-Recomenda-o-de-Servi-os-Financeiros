import api from "@/lib/axios";
import { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from "@/types";

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<any>("/auth/login", payload);
    return {
      token: data.token,
      user: data.utilizador
    };
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<any>("/auth/registar", payload);
    return {
      token: data.token,
      user: data.utilizador
    };
  },

  me: async (): Promise<AuthResponse["user"]> => {
    const { data } = await api.get("/auth/perfil");
    return data.utilizador;
  },

  atualizarConta: async (payload: Partial<Pick<AuthUser, "nome" | "email">>): Promise<AuthResponse["user"]> => {
    const { data } = await api.put<any>("/auth/perfil", payload);
    return data.utilizador;
  },

  alterarPassword: async (password_atual: string, password_nova: string): Promise<void> => {
    await api.post("/auth/alterar-password", { password_atual, password_nova });
  },
};