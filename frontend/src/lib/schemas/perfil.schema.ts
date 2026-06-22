import { z } from "zod";

// Schema para STEP 1 - apenas campos de step 1
export const step1Schema = z.object({
  situacao_emprego: z.enum(
    [
      "empregado",
      "desempregado",
      "autonomo",
      "estudante",
      "reformado",
      "empresario",
    ],
    {
      error: "Seleccione a situação de emprego.",
    }
  ),

  nivel_educacao: z.enum(
    [
      "primario",
      "secundario",
      "licenciatura",
      "mestrado",
      "doutoramento",
    ],
    {
      error: "Seleccione o nível de educação.",
    }
  ),

  dependentes: z.union([
    z.coerce
      .number({
        error: "Introduza um número.",
      })
      .int("O número de dependentes deve ser inteiro.")
      .min(0)
      .max(20),
    z.number()
      .int("O número de dependentes deve ser inteiro.")
      .min(0)
      .max(20),
  ]),

  tem_conta_bancaria: z.boolean().optional(),

  tem_historico_credito: z.boolean().optional(),

  // Incluir campos de outros steps como undefined para manter a estrutura
  rendimento_mensal: z.any().optional(),
  despesas_mensais: z.any().optional(),
  score_credito: z.any().optional(),
  objectivo_financeiro: z.any().optional(),
});

// Schema para STEP 2 - apenas campos de step 2
export const step2Schema = z.object({
  situacao_emprego: z.any().optional(),
  nivel_educacao: z.any().optional(),
  dependentes: z.any().optional(),
  tem_conta_bancaria: z.any().optional(),
  tem_historico_credito: z.any().optional(),

  rendimento_mensal: z.union([
    z.coerce
      .number({
        error: "Introduza um valor numérico.",
      })
      .min(100000, "O rendimento mínimo é 100.000,00 Kz.")
      .max(100_000_000, "Valor demasiado elevado."),
    z.undefined(),
  ]).optional(),

  despesas_mensais: z.union([
    z.coerce
      .number({
        error: "Introduza um valor numérico.",
      })
      .min(0, "As despesas não podem ser negativas."),
    z.undefined(),
  ]).optional(),

  score_credito: z.union([
    z.coerce
      .number({
        error: "Introduza um valor numérico.",
      })
      .int("O score de crédito deve ser um número inteiro.")
      .min(0)
      .max(1000),
    z.undefined(),
  ]).optional(),

  objectivo_financeiro: z.any().optional(),
}).refine(
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

// Schema para STEP 3 - apenas campos de step 3
export const step3Schema = z.object({
  situacao_emprego: z.any().optional(),
  nivel_educacao: z.any().optional(),
  dependentes: z.any().optional(),
  tem_conta_bancaria: z.any().optional(),
  tem_historico_credito: z.any().optional(),
  rendimento_mensal: z.any().optional(),
  despesas_mensais: z.any().optional(),
  score_credito: z.any().optional(),

  objectivo_financeiro: z.array(
    z.enum(
      [
        "credito_pessoal",
        "credito_habitacao",
        "credito_negocio",
        "seguro_vida",
        "seguro_saude",
        "seguro_automovel",
      ],
        {
          error: "Seleccione pelo menos um objectivo financeiro.",
        }
      )
    ).optional(),
  });

// Schema completo para validação final na submissão
export const perfilFinanceiroSchema = z
  .object({
    situacao_emprego: z.enum(
      [
        "empregado",
        "desempregado",
        "autonomo",
        "estudante",
        "reformado",
        "empresario",
      ],
      {
        error: "Seleccione a situação de emprego.",
      }
    ),

    nivel_educacao: z.enum(
      [
        "primario",
        "secundario",
        "licenciatura",
        "mestrado",
        "doutoramento",
      ],
      {
        error: "Seleccione o nível de educação.",
      }
    ),

    dependentes: z.coerce
      .number({
        error: "Introduza um número.",
      })
      .int("O número de dependentes deve ser inteiro.")
      .min(0)
      .max(20),

    tem_conta_bancaria: z.boolean().optional(),

    tem_historico_credito: z.boolean().optional(),

    rendimento_mensal: z.coerce
      .number({
        error: "Introduza um valor numérico.",
      })
      .min(100000, "O rendimento mínimo é 100.000,00 Kz.")
      .max(100_000_000, "Valor demasiado elevado.")
      .optional()
      .nullable(),

    despesas_mensais: z.coerce
      .number({
        error: "Introduza um valor numérico.",
      })
      .min(0, "As despesas não podem ser negativas.")
      .optional()
      .nullable(),

    score_credito: z.coerce
      .number({
        error: "Introduza um valor numérico.",
      })
      .int("O score de crédito deve ser um número inteiro.")
      .min(0)
      .max(1000)
      .optional()
      .nullable(),

    objectivo_financeiro: z.array(
      z.enum(
        [
          "credito_pessoal",
          "credito_habitacao",
          "credito_negocio",
          "seguro_vida",
          "seguro_saude",
          "seguro_automovel",
        ]
      )
    ).optional(),
  })
  .refine(
    (data) => {
      // Validar apenas se ambos os valores foram preenchidos e são números válidos
      const temRendimento = data.rendimento_mensal !== undefined && data.rendimento_mensal !== null && data.rendimento_mensal > 0;
      const temDespesas = data.despesas_mensais !== undefined && data.despesas_mensais !== null && data.despesas_mensais >= 0;
      
      // Se algum dos valores está vazio, não validar
      if (!temRendimento || !temDespesas) {
        return true;
      }
      
      // Se ambos existem, validar a regra
      return data.despesas_mensais! < data.rendimento_mensal!;
    },
    {
      message:
        "As despesas não podem ser superiores ao rendimento.",
      path: ["despesas_mensais"],
    }
  );

export type PerfilFinanceiroFormValues =
  z.infer<typeof perfilFinanceiroSchema>;