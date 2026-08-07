import api from "@/lib/axios";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

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
};