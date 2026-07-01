"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/ui/stepper";
import StepEmployInfo from "@/components/onboarding/StepEmployInfo";
import StepFinancialInfo from "@/components/onboarding/StepFinancialInfo";
import StepObjectives from "@/components/onboarding/StepObjectives";
import { useFormStorage } from "@/hooks/useFormStorage";
import { perfilService } from "@/services/perfil.service";
import { PerfilFinanceiroPayload } from "@/types";

const STEPS = [
  { number: 1, label: "Situação Pessoal" },
  { number: 2, label: "Situação Financeira" },
  { number: 3, label: "Objectivo" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { saveStepData, getStepData, clearData } = useFormStorage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStep1Next = (data: Record<string, unknown>) => {
    saveStepData(1, data);
    setCurrentStep(2);
    setError(null);
  };

  const handleStep2Next = (data: Record<string, unknown>) => {
    saveStepData(2, data);
    setCurrentStep(3);
    setError(null);
  };

  const handleStep3Submit = async (data: Record<string, unknown>) => {
    saveStepData(3, data);
    setLoading(true);
    setError(null);

    try {
      const step1 = getStepData(1);
      const step2 = getStepData(2);
      const step3 = data;

      const payload: PerfilFinanceiroPayload = {
        situacao_emprego: step1.situacao_emprego as PerfilFinanceiroPayload["situacao_emprego"],
        nivel_educacao: step1.nivel_educacao as PerfilFinanceiroPayload["nivel_educacao"],
        dependentes: Number(step1.dependentes) || 0,
        tem_conta_bancaria: Boolean(step1.tem_conta_bancaria),
        tem_historico_credito: Boolean(step1.tem_historico_credito),
        rendimento_mensal: Number(step2.rendimento) || 0,
        despesas_mensais: Number(step2.despesas) || 0,
        score_credito: step2.score_credito ? Number(step2.score_credito) : undefined,
        objectivos: (step3.objectivos as string[]) ?? [],
      };

      await perfilService.create(payload);
      clearData();
      router.replace("/recomendacoes");
    } catch {
      setError("Ocorreu um erro ao guardar o seu perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-[840px]" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-[840px] flex flex-col gap-10">
        <Stepper steps={STEPS} currentStep={currentStep} />

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="bg-card rounded-xl shadow-lg p-8 md:p-[32px_32px_48px]">
          {currentStep === 1 && (
            <>
              <div className="flex flex-col gap-1 mb-8">
                <h1 className="font-heading text-[32px] font-semibold text-primary">
                  Conte-nos sobre si
                </h1>
                <p className="text-muted-foreground text-base">
                  Para criarmos recomendações personalizadas, precisamos entender o seu contexto actual.
                </p>
              </div>
              <StepEmployInfo
                defaultValues={getStepData(1)}
                onNext={handleStep1Next}
              />
            </>
          )}

          {currentStep === 2 && (
            <StepFinancialInfo
              defaultValues={getStepData(2)}
              onBack={() => setCurrentStep(1)}
              onNext={handleStep2Next}
            />
          )}

          {currentStep === 3 && (
            <StepObjectives
              defaultValues={getStepData(3)}
              onBack={() => setCurrentStep(2)}
              onNext={handleStep3Submit}
            />
          )}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-background/60 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-xl shadow-lg flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">A guardar o seu perfil...</p>
          </div>
        </div>
      )}
    </div>
  );
}
