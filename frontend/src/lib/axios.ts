import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { ApiError } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("srf_auth");
      if (raw) {
        try {
          const { state } = JSON.parse(raw);
          if (state?.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
        } catch { /* ignore */ }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("srf_auth");
        window.location.href = "/login";
      }
    }

    const apiError: ApiError = {
      message:
        (error.response?.data as { message?: string })?.message ??
        "Ocorreu um erro inesperado.",
      errors: (error.response?.data as { errors?: Record<string, string[]> })
        ?.errors,
      status: status ?? 500,
    };
    return Promise.reject(apiError);
  }
);

export default api;
