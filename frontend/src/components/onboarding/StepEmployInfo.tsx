"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Monitor, Building2, GraduationCap } from "lucide-react";

const step1FormSchema = z.object({
  situacao_emprego: z.enum(["empregado", "desempregado", "autonomo", "estudante", "reformado"], {
    error: "Seleccione a situação de emprego.",
  }),
  nivel_educacao: z.enum(["primaria", "secundaria", "licenciatura", "mestrado", "doutoramento"], {
    error: "Seleccione o nível de educação.",
  }),
  dependentes: z.number().int().min(0).max(20),
  tem_conta_bancaria: z.boolean().optional(),
  tem_historico_credito: z.boolean().optional(),
});

type Step1Data = z.infer<typeof step1FormSchema>;

const SITUACAO_OPTIONS = [
  { value: "empregado", icon: BriefcaseBusiness, title: "Empregado", desc: "Contrato por conta de outrem" },
  { value: "autonomo", icon: Monitor, title: "Autónomo", desc: "Trabalhador independente" },
  { value: "empresario", icon: Building2, title: "Empresário", desc: "Proprietário de negócio" },
  { value: "estudante", icon: GraduationCap, title: "Estudante / Outros", desc: "Ainda não no mercado" },
];

const EDUCACAO_OPTIONS = [
  { value: "primaria", label: "Ensino Primário" },
  { value: "secundaria", label: "Ensino Médio" },
  { value: "licenciatura", label: "Licenciatura" },
  { value: "mestrado", label: "Mestrado" },
  { value: "doutoramento", label: "Doutoramento" },
];

interface StepEmployInfoProps {
  defaultValues?: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
}

export default function StepEmployInfo({ defaultValues, onNext }: StepEmployInfoProps) {
  const sanitizedDefaultValues = { ...defaultValues };
  if (sanitizedDefaultValues.nivel_educacao === "primario") {
    sanitizedDefaultValues.nivel_educacao = "primaria";
  }
  if (sanitizedDefaultValues.nivel_educacao === "secundario") {
    sanitizedDefaultValues.nivel_educacao = "secundaria";
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1FormSchema),
    defaultValues: {
      situacao_emprego: undefined as unknown as Step1Data["situacao_emprego"],
      nivel_educacao: undefined as unknown as Step1Data["nivel_educacao"],
      dependentes: 0,
      tem_conta_bancaria: false,
      tem_historico_credito: false,
      ...((sanitizedDefaultValues ?? {}) as Partial<Step1Data>),
    },
  });

  const situacao = watch("situacao_emprego");
  const educacao = watch("nivel_educacao");
  const conta = watch("tem_conta_bancaria");
  const credito = watch("tem_historico_credito");
  const dependentes = watch("dependentes");

  return (
    <form onSubmit={handleSubmit((data) => onNext(data as unknown as Record<string, unknown>))} className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <span className="text-primary text-sm font-medium tracking-[0.7px] uppercase">Situação Profissional</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SITUACAO_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = situacao === opt.value;
            return (
              <label
                key={opt.value}
                className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-primary border-primary shadow-md"
                    : "bg-card border-[#c4c6d0] hover:shadow-sm"
                }`}
                style={{ height: 82 }}
              >
                <input type="radio" className="hidden" {...register("situacao_emprego")} value={opt.value} />
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? "bg-white/20" : "bg-primary"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-[#7c94ca]"}`} />
                </div>
                <div>
                  <p
                    className={`font-bold text-base ${isSelected ? "text-white" : "text-foreground"}`}
                  >
                    {opt.title}
                  </p>
                  <p className={`text-base ${isSelected ? "text-white/90" : "text-muted-foreground"}`}>
                    {opt.desc}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
        {errors.situacao_emprego && (
          <span className="text-destructive text-xs">{errors.situacao_emprego.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-primary text-sm font-medium tracking-[0.7px] uppercase">Nível de Escolaridade</span>
        <div className="flex flex-wrap gap-2">
          {EDUCACAO_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`px-4 py-2 rounded-full border cursor-pointer transition-all text-sm font-medium ${
                educacao === opt.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-white border-[#c4c6d0] hover:border-primary/50"
              }`}
            >
              <input type="radio" className="hidden" {...register("nivel_educacao")} value={opt.value} />
              {opt.label}
            </label>
          ))}
        </div>
        {errors.nivel_educacao && (
          <span className="text-destructive text-xs">{errors.nivel_educacao.message}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-primary text-sm font-medium tracking-[0.7px]">Número de Dependentes</span>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setValue("dependentes", n, { shouldValidate: true })}
                className={`w-12 h-12 rounded-full border cursor-pointer transition-all text-base font-bold ${
                  dependentes === n
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-white border-[#c4c6d0] hover:border-primary/50"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {errors.dependentes && (
            <span className="text-destructive text-xs">{errors.dependentes.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-12 min-w-[320px]">
            <div>
              <p className="text-foreground font-bold text-base">Conta Bancária</p>
              <p className="text-muted-foreground text-base">Possui conta activa em Angola?</p>
            </div>
            <button
              type="button"
              className={`relative w-11 h-6 rounded-full transition-colors ${conta ? "bg-[#835500]" : "bg-[#c4c6d0]"}`}
              onClick={() => setValue("tem_conta_bancaria", !conta, { shouldValidate: true })}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white border transition-all ${
                  conta ? "right-0.5 border-white" : "left-0.5 border-[#d1d5db]"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-12 min-w-[320px]">
            <div>
              <p className="text-foreground font-bold text-base">Histórico de Crédito</p>
              <p className="text-muted-foreground text-base">Já solicitou empréstimos antes?</p>
            </div>
            <button
              type="button"
              className={`relative w-11 h-6 rounded-full transition-colors ${credito ? "bg-[#835500]" : "bg-[#c4c6d0]"}`}
              onClick={() => setValue("tem_historico_credito", !credito, { shouldValidate: true })}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white border transition-all ${
                  credito ? "right-0.5 border-white" : "left-0.5 border-[#d1d5db]"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8 border-t border-[#c4c6d0]">
        <div />
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
