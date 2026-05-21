import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthUser, UserTipo } from "@/types";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) =>
        set({ token, user, isAuthenticated: true }),

      clearAuth: () =>
        set({ token: null, user: null, isAuthenticated: false }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: "srf_auth",
      storage: createJSONStorage(() => localStorage),
      // Só persiste token e user — isAuthenticated é derivado
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ─── Selectores convenientes ──────────────────────────────────────────────────
export const selectTipo = (state: AuthState): UserTipo | null =>
  state.user?.tipo ?? null;

export const selectIsUtilizador = (state: AuthState): boolean =>
  state.user?.tipo === "utilizador";

export const selectIsProvedor = (state: AuthState): boolean =>
  state.user?.tipo === "provedor";

export const selectIsAdmin = (state: AuthState): boolean =>
  state.user?.tipo === "admin";