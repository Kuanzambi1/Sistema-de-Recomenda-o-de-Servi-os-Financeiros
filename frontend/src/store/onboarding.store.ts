import { create } from "zustand"

interface OnboardingState {
  step1: Record<string, unknown>
  step2: Record<string, unknown>
  step3: Record<string, unknown>
  completed: boolean
  setStep: (step: 1 | 2 | 3, data: Record<string, unknown>) => void
  getStep: (step: 1 | 2 | 3) => Record<string, unknown>
  getAll: () => Record<string, unknown> | null
  markCompleted: () => void
  clear: () => void
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  step1: {},
  step2: {},
  step3: {},
  completed: false,
  setStep: (step, data) => set({ [`step${step}`]: data }),
  getStep: (step) => get()[`step${step}`],
  getAll: () => {
    const state = get()
    if (!state.step1 || !state.step2 || !state.step3) return null
    return { ...state.step1, ...state.step2, ...state.step3 }
  },
  markCompleted: () => set({ completed: true }),
  clear: () => set({ step1: {}, step2: {}, step3: {}, completed: false }),
}))
