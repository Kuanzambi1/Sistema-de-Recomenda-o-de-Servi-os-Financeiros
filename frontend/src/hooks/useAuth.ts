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

  const login = useCallback(
    (token: string, user: AuthUser) => {
      setAuth(token, user);
      redirectByTipo(user.tipo, router, user);
    },
    [setAuth, router]
  );

  const logout = useCallback(() => {
    clearAuth();
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
      router.replace("/recomendacoes");
      break;
  }
}
