"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Landmark,
  Building,
  Briefcase,
  Heart,
  PiggyBank,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const OBJECTIVOS = [
  {
    value: "credito",
    icon: Landmark,
    title: "Crédito",
    desc: "Crédito pessoal, habitação e microcrédito",
  },
  {
    value: "poupanca",
    icon: PiggyBank,
    title: "Poupança",
    desc: "Guardar e rentabilizar dinheiro",
  },
  {
    value: "investimento",
    icon: Briefcase,
    title: "Investimento",
    desc: "Fazer o dinheiro crescer",
  },
  {
    value: "seguro",
    icon: Heart,
    title: "Seguro",
    desc: "Proteção para si e sua família",
  },
  {
    value: "todos",
    icon: Building,
    title: "Todos",
    desc: "Quero ver todas as opções",
  },
];

const step3FormSchema = z.object({
  objectivo_financeiro: z.string().min(1, "Seleccione um objectivo financeiro."),
});

type Step3Data = z.infer<typeof step3FormSchema>;

interface StepObjectivesProps {
  defaultValues?: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onBack: () => void;
}

export default function StepObjectives({ defaultValues, onNext, onBack }: StepObjectivesProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3FormSchema),
    defaultValues: {
      objectivo_financeiro: "",
      ...((defaultValues ?? {}) as Partial<Step3Data>),
    },
  });

  const selected = watch("objectivo_financeiro") ?? "";

  return (
    <form
      onSubmit={handleSubmit((data) => onNext(data as unknown as Record<string, unknown>))}
      className="flex flex-col gap-8 items-center"
    >
      <div className="text-center">
        <h1 className="font-heading text-[32px] font-semibold text-primary mb-1">
          O que está à procura?
        </h1>
        <p className="text-muted-foreground text-base">
          Selecione o objectivo financeiro principal
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {OBJECTIVOS.map((obj) => {
          const Icon = obj.icon;
          const isSelected = selected === obj.value;
          return (
            <label
              key={obj.value}
              className={`relative flex flex-col gap-4 p-6 rounded-xl cursor-pointer text-left transition-all ${
                isSelected
                  ? "border-2 border-primary bg-primary/5 shadow-md shadow-primary/5"
                  : "border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.04] hover:shadow-sm"
              }`}
            >
              <input
                type="radio"
                {...register("objectivo_financeiro")}
                value={obj.value}
                className="sr-only"
              />
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                style={{ borderColor: isSelected ? "var(--primary)" : "rgba(255,255,255,0.15)" }}
              >
                {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
              </div>
              <div className="w-12 h-12 rounded-lg bg-[#0f2b5b] flex items-center justify-center">
                <Icon className="w-6 h-6 text-[#7c94ca]" />
              </div>
              <div>
                <p className="font-heading text-lg text-primary">{obj.title}</p>
                <p className="text-muted-foreground text-sm">{obj.desc}</p>
              </div>
            </label>
          );
        })}
      </div>

      {errors.objectivo_financeiro && (
        <span className="text-destructive text-xs">{errors.objectivo_financeiro.message}</span>
      )}

      <div className="flex justify-between items-center pt-8 border-t border-[#c4c6d0] w-full">
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
          style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.1)" }}
        >
          Ver as minhas recomendações
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
