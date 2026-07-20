"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/ui/stepper";
import StepEmployInfo from "@/components/onboarding/StepEmployInfo";
import StepFinancialInfo from "@/components/onboarding/StepFinancialInfo";
import StepObjectives from "@/components/onboarding/StepObjectives";
import { useOnboardingStore } from "@/store/onboarding.store";
import { perfilService } from "@/services/perfil.service";
import { PerfilFinanceiroPayload } from "@/types";
import { Brain, Cpu, Sparkles } from "lucide-react";

const STEPS = [
  { number: 1, label: "Situação Pessoal" },
  { number: 2, label: "Situação Financeira" },
  { number: 3, label: "Objectivo" },
];

const LOADING_MESSAGES = [
  "Analisando perfil financeiro...",
  "Calculando compatibilidades...",
  "Processando dados com IA...",
  "Gerando recomendações personalizadas...",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
<<<<<<< HEAD
  const [loadingMsg, setLoadingMsg] = useState(0);
  const { saveStepData, getStepData, clearData } = useFormStorage();
=======
  const { setStep, getStep, clear } = useOnboardingStore();
>>>>>>> 8d6439d (refactor: rename (admin) to admin, add notificacoes/provedores/recomendacoes pages, remove localStorage)

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cycle loading messages
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleStep1Next = (data: Record<string, unknown>) => {
    setStep(1, data);
    setCurrentStep(2);
    setError(null);
  };

  const handleStep2Next = (data: Record<string, unknown>) => {
    setStep(2, data);
    setCurrentStep(3);
    setError(null);
  };

  const handleStep3Submit = async (data: Record<string, unknown>) => {
    setStep(3, data);
    setLoading(true);
    setError(null);

    try {
      const step1 = getStep(1);
      const step2 = getStep(2);
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

<<<<<<< HEAD
      try {
        await perfilService.criar(payload);
      } catch (err: any) {
        if (err.status === 409) {
          await perfilService.atualizar(payload);
        } else {
          throw err;
        }
      }
      
      clearData();
=======
      await perfilService.create(payload);
      clear();
>>>>>>> 8d6439d (refactor: rename (admin) to admin, add notificacoes/provedores/recomendacoes pages, remove localStorage)
      router.replace("/recomendacoes");
    } catch (err: any) {
      console.error(err);
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
    <div className="relative flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 ai-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[840px] flex flex-col gap-10 relative z-10">
        {/* Header badge */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Brain className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Configuração do Perfil IA</span>
          </div>
        </div>

        <Stepper steps={STEPS} currentStep={currentStep} />

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center border border-destructive/20">
            {error}
          </div>
        )}

<<<<<<< HEAD
        <div className="glass-card rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.05)] p-8 md:p-[32px_32px_48px] relative overflow-hidden gradient-line-top">
          {/* Data stream effect */}
          <div className="absolute inset-0 animate-data-stream opacity-20 pointer-events-none" />
          
          <div className="relative z-10">
            {currentStep === 1 && (
              <>
                <div className="flex flex-col gap-1 mb-8">
                  <h1 className="font-heading text-[32px] font-bold text-white tracking-tight flex items-center gap-3">
                    Conte-nos sobre si
                    <Cpu className="w-6 h-6 text-blue-400/50" />
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
=======
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
                defaultValues={getStep(1)}
                onNext={handleStep1Next}
>>>>>>> 8d6439d (refactor: rename (admin) to admin, add notificacoes/provedores/recomendacoes pages, remove localStorage)
              />
            )}

<<<<<<< HEAD
            {currentStep === 3 && (
              <StepObjectives
                defaultValues={getStepData(3)}
                onBack={() => setCurrentStep(2)}
                onNext={handleStep3Submit}
              />
            )}
          </div>
=======
          {currentStep === 2 && (
            <StepFinancialInfo
              defaultValues={getStep(2)}
              onBack={() => setCurrentStep(1)}
              onNext={handleStep2Next}
            />
          )}

          {currentStep === 3 && (
            <StepObjectives
                defaultValues={getStep(3)}
              onBack={() => setCurrentStep(2)}
              onNext={handleStep3Submit}
            />
          )}
>>>>>>> 8d6439d (refactor: rename (admin) to admin, add notificacoes/provedores/recomendacoes pages, remove localStorage)
        </div>
      </div>

      {/* AI Processing Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-[#0A0D14]/80 backdrop-blur-md flex items-center justify-center z-50">
          <div className="glass-card neon-border p-10 rounded-3xl flex flex-col items-center gap-6 max-w-sm w-full mx-4">
            {/* Brain animation */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-[30px]" />
              <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-violet-500/15 border-dashed animate-[spin_3s_linear_infinite_reverse]" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-600/20 to-violet-600/20 flex items-center justify-center animate-pulse-glow border border-white/10">
                <Brain className="w-10 h-10 text-blue-400" />
              </div>
              {/* Orbiting dots */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{"--orbit-radius": "45px"} as React.CSSProperties}>
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-reverse" style={{"--orbit-radius": "38px"} as React.CSSProperties}>
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-blue-500 rounded-full animate-[shimmer_2s_linear_infinite] bg-[length:200%_100%]" style={{width: "85%"}} />
              </div>
            </div>

            {/* Cycling messages */}
            <div className="text-center">
              <p className="text-sm text-white font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-blue-400" />
                Motor de IA a processar
              </p>
              <p className="text-xs text-muted-foreground animate-in fade-in duration-500" key={loadingMsg}>
                {LOADING_MESSAGES[loadingMsg]}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
