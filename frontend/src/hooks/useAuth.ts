"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  useAuthStore,
  selectIsUtilizador,
  selectIsProvedor,
  selectIsAdmin,
} from "@/store/auth.store";
import { AuthUser, UserTipo } from "@/types";

export function useAuth() {
  const router = useRouter();
  const { token, user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const isUtilizador = useAuthStore(selectIsUtilizador);
  const isProvedor = useAuthStore(selectIsProvedor);
  const isAdmin = useAuthStore(selectIsAdmin);

  // ─── Guarda token e user após login ────────────────────────────────────────
  const login = useCallback(
    (token: string, user: AuthUser) => {
      setAuth(token, user);
      // Também guarda no localStorage para o interceptor Axios
      localStorage.setItem("srf_token", token);
      redirectByTipo(user.tipo, router, user);
    },
    [setAuth, router]
  );

  // ─── Limpa tudo e redireciona para login ───────────────────────────────────
  const logout = useCallback(() => {
    clearAuth();
    localStorage.removeItem("srf_token");
    localStorage.removeItem("srf_user");
    router.replace("/login");
  }, [clearAuth, router]);

  return {
    token,
    user,
    isAuthenticated,
    isUtilizador,
    isProvedor,
    isAdmin,
    login,
    logout,
  };
}

// ─── Redirecionamento por tipo de utilizador ──────────────────────────────────
export function redirectByTipo(
  tipo: UserTipo,
  router: ReturnType<typeof useRouter>,
  user?: AuthUser
) {
  switch (tipo) {
    case "admin":
      router.replace("/admin/dashboard");
      break;
    case "provedor":
      router.replace("/servicos");
      break;
    case "utilizador":
      // Se ainda não tem perfil financeiro → onboarding
      // O backend deverá indicar isto; por agora usamos flag no user
      router.replace("/recomendacoes");
      break;
  }
}