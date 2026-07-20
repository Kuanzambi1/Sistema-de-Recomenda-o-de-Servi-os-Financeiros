import { create } from "zustand"

interface NewUserState {
  step1: { nome?: string; email?: string; telefone?: string }
  step2: { perfil?: "user" | "provider" | "admin"; permissoes?: { relatorios: boolean; servicos: boolean; auditoria: boolean } }
  setStep1: (data: { nome: string; email: string; telefone: string }) => void
  setStep2: (data: { perfil: "user" | "provider" | "admin"; permissoes: { relatorios: boolean; servicos: boolean; auditoria: boolean } }) => void
  clear: () => void
}

export const useNewUserStore = create<NewUserState>((set) => ({
  step1: {},
  step2: {},
  setStep1: (data) => set({ step1: data }),
  setStep2: (data) => set({ step2: data }),
  clear: () => set({ step1: {}, step2: {} }),
}))
