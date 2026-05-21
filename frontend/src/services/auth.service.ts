import api from "@/lib/axios";
import { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },

  me: async (): Promise<AuthResponse["user"]> => {
    const { data } = await api.get("/auth/me");
    return data;
  },
};