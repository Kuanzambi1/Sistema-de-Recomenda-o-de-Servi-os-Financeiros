import { z } from "zod";

const OBJETIVO_FINANCEIRO_VALUES = [
  "credito_pessoal",
  "credito_habitacao",
  "credito_negocio",
  "seguro_vida",
  "seguro_saude",
  "seguro_automovel",
] as const;

const SITUACAO_EMPREGO_VALUES = [
  "empregado",
  "desempregado",
  "autonomo",
  "estudante",
  "reformado",
] as const;

const NIVEL_EDUCACAO_VALUES = [
  "primario",
  "secundario",
  "licenciatura",
  "mestrado",
  "doutoramento",
] as const;

// Schema para STEP 1 - apenas campos de step 1
export const step1Schema = z.object({
  situacao_emprego: z.enum(SITUACAO_EMPREGO_VALUES, {
    error: "Seleccione a situação de emprego.",
  }),

  nivel_educacao: z.enum(NIVEL_EDUCACAO_VALUES, {
    error: "Seleccione o nível de educação.",
  }),

  dependentes: z.coerce
    .number({ error: "Introduza um número." })
    .int("O número de dependentes deve ser inteiro.")
    .min(0)
    .max(20),

  tem_conta_bancaria: z.boolean().optional(),

  tem_historico_credito: z.boolean().optional(),

  rendimento_mensal: z.undefined(),
  despesas_mensais: z.undefined(),
  score_credito: z.undefined(),
  objectivo_financeiro: z.undefined(),
});

// Schema para STEP 2 - apenas campos de step 2
export const step2Schema = z.object({
  situacao_emprego: z.undefined(),
  nivel_educacao: z.undefined(),
  dependentes: z.undefined(),
  tem_conta_bancaria: z.undefined(),
  tem_historico_credito: z.undefined(),

  rendimento_mensal: z.coerce
    .number({ error: "Introduza um valor numérico." })
    .min(100_000, "O rendimento mínimo é 100.000,00 Kz.")
    .max(100_000_000, "Valor demasiado elevado."),

  despesas_mensais: z.coerce
    .number({ error: "Introduza um valor numérico." })
    .min(0, "As despesas não podem ser negativas."),

  score_credito: z.coerce
    .number({ error: "Introduza um valor numérico." })
    .int("O score de crédito deve ser um número inteiro.")
    .min(0)
    .max(1000)
    .optional()
    .nullable(),

  objectivo_financeiro: z.undefined(),
}).refine(
  (data) => data.despesas_mensais < data.rendimento_mensal,
  {
    message: "As despesas não podem ser superiores ao rendimento.",
    path: ["despesas_mensais"],
  }
);

// Schema para STEP 3 - apenas campos de step 3
export const step3Schema = z.object({
  situacao_emprego: z.undefined(),
  nivel_educacao: z.undefined(),
  dependentes: z.undefined(),
  tem_conta_bancaria: z.undefined(),
  tem_historico_credito: z.undefined(),
  rendimento_mensal: z.undefined(),
  despesas_mensais: z.undefined(),
  score_credito: z.undefined(),

  objectivo_financeiro: z.array(
    z.enum(OBJETIVO_FINANCEIRO_VALUES, {
      error: "Objectivo financeiro inválido.",
    })
  ).min(1, "Seleccione pelo menos um objectivo financeiro."),
});

// Schema completo para validação final na submissão
export const perfilFinanceiroSchema = z
  .object({
    situacao_emprego: z.enum(SITUACAO_EMPREGO_VALUES, {
      error: "Seleccione a situação de emprego.",
    }),

    nivel_educacao: z.enum(NIVEL_EDUCACAO_VALUES, {
      error: "Seleccione o nível de educação.",
    }),

    dependentes: z.coerce
      .number({ error: "Introduza um número." })
      .int("O número de dependentes deve ser inteiro.")
      .min(0)
      .max(20),

    tem_conta_bancaria: z.boolean().optional(),

    tem_historico_credito: z.boolean().optional(),

    rendimento_mensal: z.coerce
      .number({ error: "Introduza um valor numérico." })
      .min(100_000, "O rendimento mínimo é 100.000,00 Kz.")
      .max(100_000_000, "Valor demasiado elevado.")
      .optional()
      .nullable(),

    despesas_mensais: z.coerce
      .number({ error: "Introduza um valor numérico." })
      .min(0, "As despesas não podem ser negativas.")
      .optional()
      .nullable(),

    score_credito: z.coerce
      .number({ error: "Introduza um valor numérico." })
      .int("O score de crédito deve ser um número inteiro.")
      .min(0)
      .max(1000)
      .optional()
      .nullable(),

    objectivo_financeiro: z.array(
      z.enum(OBJETIVO_FINANCEIRO_VALUES, {
        error: "Objectivo financeiro inválido.",
      })
    ).optional(),
  })
  .refine(
    (data) => {
      const temRendimento = data.rendimento_mensal !== undefined && data.rendimento_mensal !== null && data.rendimento_mensal > 0;
      const temDespesas = data.despesas_mensais !== undefined && data.despesas_mensais !== null && data.despesas_mensais >= 0;
      
      if (!temRendimento || !temDespesas) {
        return true;
      }
      
      return data.despesas_mensais! < data.rendimento_mensal!;
    },
    {
      message: "As despesas não podem ser superiores ao rendimento.",
      path: ["despesas_mensais"],
    }
  );

export type PerfilFinanceiroFormValues =
  z.infer<typeof perfilFinanceiroSchema>;