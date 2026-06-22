import { useCallback } from "react";
import { PerfilFinanceiroFormValues } from "@/lib/schemas/perfil.schema";

const STORAGE_KEY = "perfil-financeiro-form";

interface StorageData {
  step1?: Partial<PerfilFinanceiroFormValues>;
  step2?: Partial<PerfilFinanceiroFormValues>;
  step3?: Partial<PerfilFinanceiroFormValues>;
  completed: boolean;
}

export function useFormStorage() {
  const getStoredData = useCallback((): StorageData => {
    if (typeof window === "undefined") {
      return { completed: false };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { completed: false };
    } catch {
      return { completed: false };
    }
  }, []);

  const saveStepData = useCallback(
    (stepNumber: 1 | 2 | 3, data: Partial<PerfilFinanceiroFormValues>) => {
      if (typeof window === "undefined") return;

      try {
        const current = getStoredData();
        const stepKey = `step${stepNumber}` as const;
        current[stepKey] = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch (error) {
        console.error("Erro ao salvar dados:", error);
      }
    },
    [getStoredData]
  );

  const getStepData = useCallback(
    (stepNumber: 1 | 2 | 3): Partial<PerfilFinanceiroFormValues> => {
      const data = getStoredData();
      const stepKey = `step${stepNumber}` as const;
      return data[stepKey] || {};
    },
    [getStoredData]
  );

  const getAllData = useCallback((): PerfilFinanceiroFormValues | null => {
    const data = getStoredData();
    if (!data.step1 || !data.step2 || !data.step3) {
      return null;
    }

    return {
      ...data.step1,
      ...data.step2,
      ...data.step3,
    } as PerfilFinanceiroFormValues;
  }, [getStoredData]);

  const clearData = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const markAsCompleted = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const current = getStoredData();
      current.completed = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (error) {
      console.error("Erro ao marcar como completo:", error);
    }
  }, [getStoredData]);

  return {
    getStoredData,
    saveStepData,
    getStepData,
    getAllData,
    clearData,
    markAsCompleted,
  };
}
