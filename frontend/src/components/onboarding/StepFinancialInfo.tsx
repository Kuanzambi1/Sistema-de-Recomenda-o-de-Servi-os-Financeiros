"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { AlertTriangle, ArrowRight, ArrowLeft, Info, ChevronRight } from "lucide-react";

const step2FormSchema = z.object({
  rendimento: z.coerce.number().min(1, "Rendimento mensal é obrigatório."),
  despesas: z.coerce.number().min(1, "Despesas mensais são obrigatórias."),
  score_credito: z
    .union([z.literal(""), z.coerce.number().int().min(0).max(999)])
    .optional(),
});

type Step2Data = z.input<typeof step2FormSchema>;

interface StepFinancialInfoProps {
  defaultValues?: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
}

export default function StepFinancialInfo({ defaultValues, onNext, onBack }: StepFinancialInfoProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2FormSchema),
    defaultValues: {
      rendimento: "" as unknown as number,
      despesas: "" as unknown as number,
      score_credito: "",
      ...((defaultValues ?? {}) as Partial<Step2Data>),
    },
  });

  const rendimentoStr = watch("rendimento");
  const despesasStr = watch("despesas");
  const rendimento = Number(rendimentoStr) || 0;
  const despesas = Number(despesasStr) || 0;
  const capacidade = rendimento - despesas;

  return (
    <form onSubmit={handleSubmit((data) => onNext(data as unknown as Record<string, unknown>))} className="flex flex-col gap-8">
      <div className="flex items-start gap-3 p-4 rounded-lg bg-[#ffddb44d] border border-[#feae2c]">
        <AlertTriangle className="w-5 h-5 text-[#6b4500] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <p className="text-[#291800] font-bold text-sm">Confidencialidade de Dados</p>
          <p className="text-[#633f00] text-sm">
            Suas informações financeiras são criptografadas e utilizadas exclusivamente para
            gerar recomendações personalizadas em conformidade com as leis de proteção
            de dados de Angola.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-muted-foreground text-sm">Rendimento mensal (Kz)</label>
          <div className="relative">
            <Input
              type="number"
              className="bg-[#f9f9ff] border-[#c4c6d0] rounded-lg pt-[18px] pb-[17px] pl-8"
              {...register("rendimento", { valueAsNumber: true })}
              placeholder="0"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base font-medium">
              Kz
            </span>
          </div>
          {errors.rendimento && (
            <span className="text-destructive text-xs">{errors.rendimento.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-muted-foreground text-sm">Despesas mensais (Kz)</label>
          <div className="relative">
            <Input
              type="number"
              className="bg-[#f9f9ff] border-[#c4c6d0] rounded-lg pt-[18px] pb-[17px] pl-8"
              {...register("despesas", { valueAsNumber: true })}
              placeholder="0"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base font-medium">
              Kz
            </span>
          </div>
          {errors.despesas && (
            <span className="text-destructive text-xs">{errors.despesas.message}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 p-6 rounded-xl bg-[#0f2b5b] border border-[#afc6ff33] w-full">
        <div className="w-12 h-12 rounded-full bg-[#7c94ca33] flex items-center justify-center shrink-0">
          <Info className="w-6 h-6 text-[#7c94ca]" />
        </div>
        <div className="flex flex-col gap-0.5 flex-1">
          <p className="text-[#7c94cacc] text-sm">Capacidade de endividamento estimada</p>
          <p className="text-white font-semibold text-2xl font-heading">
            {capacidade > 0 ? `${capacidade.toLocaleString()} Kz` : "--- Kz"}
          </p>
        </div>
        <ChevronRight className="w-6 h-6 text-[#7c94ca]" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-muted-foreground text-sm">Score de Crédito (opcional)</label>
        <Input
          type="number"
          className="bg-[#f9f9ff] border-[#c4c6d0] rounded-lg w-[240px]"
          {...register("score_credito")}
          placeholder="Ex: 650"
        />
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-[#c4c6d0]">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-primary font-bold text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>
        <button
          type="submit"
          className="flex items-center gap-4 bg-primary text-white font-bold text-base px-8 py-4 rounded-lg shadow-md"
        >
          Continuar
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
