import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ─── Request interceptor — injeta token em todos os pedidos ──────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("srf_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — trata erros globais ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    // Token expirado ou inválido — força logout
    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("srf_token");
        localStorage.removeItem("srf_user");
        window.location.href = "/login";
      }
    }

    const data = error.response?.data as any;
    const apiError: ApiError = {
      message:
        data?.message ??
        data?.erro ??
        "Ocorreu um erro inesperado.",
      errors: data?.errors ?? data?.campos,
      status: status ?? 500,
    };
    return Promise.reject(apiError);
  }
);

export default api;