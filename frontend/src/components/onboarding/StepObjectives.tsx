"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Landmark,
  Building,
  Briefcase,
  Heart,
  HeartPulse,
  Car,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const OBJECTIVOS = [
  {
    value: "credito_pessoal",
    icon: Landmark,
    title: "Crédito Pessoal",
    desc: "Empréstimo para uso pessoal",
  },
  {
    value: "habitacao",
    icon: Building,
    title: "Habitação",
    desc: "Financiamento para casa própria",
  },
  {
    value: "negocio",
    icon: Briefcase,
    title: "Negócio",
    desc: "Capital para empreender",
  },
  {
    value: "seguro_vida",
    icon: Heart,
    title: "Seguro de Vida",
    desc: "Proteção para a sua família",
  },
  {
    value: "saude",
    icon: HeartPulse,
    title: "Saúde",
    desc: "Cobertura de saúde privada",
  },
  {
    value: "automovel",
    icon: Car,
    title: "Automóvel",
    desc: "Crédito para veículo",
  },
];

const step3FormSchema = z.object({
  objectivos: z.array(z.string()).min(1, "Seleccione pelo menos um objectivo."),
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
    setValue,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3FormSchema),
    defaultValues: {
      objectivos: [],
      ...((defaultValues ?? {}) as Partial<Step3Data>),
    },
  });

  const selected = watch("objectivos") ?? [];

  const toggleObjectivo = (value: string) => {
    if (selected.includes(value)) {
      setValue("objectivos", selected.filter((v: string) => v !== value), { shouldValidate: true });
    } else {
      setValue("objectivos", [...selected, value], { shouldValidate: true });
    }
  };

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
          Selecione os serviços financeiros que mais lhe interessam
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
        {OBJECTIVOS.map((obj) => {
          const Icon = obj.icon;
          const isSelected = selected.includes(obj.value);
          return (
            <button
              type="button"
              key={obj.value}
              onClick={() => toggleObjectivo(obj.value)}
              className={`relative flex flex-col gap-4 p-6 rounded-xl bg-card cursor-pointer text-left transition-all ${
                isSelected ? "border-2 border-primary shadow-md" : "border border-[#c4c6d0] hover:shadow-sm"
              }`}
            >
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                style={{ borderColor: isSelected ? "#00163c" : "#c4c6d0" }}
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
            </button>
          );
        })}
      </div>

      {errors.objectivos && (
        <span className="text-destructive text-xs">{errors.objectivos.message}</span>
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
