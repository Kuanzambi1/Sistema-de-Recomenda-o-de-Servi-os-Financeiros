import { z } from "zod";

export const perfilFinanceiroSchema = z
  .object({
    rendimento_mensal: z.coerce
      .number({
        error: "Introduza um valor numérico.",
      })
      .min(0, "O rendimento não pode ser negativo.")
      .max(100_000_000, "Valor demasiado elevado."),

    despesas_mensais: z.coerce
      .number({
        error: "Introduza um valor numérico.",
      })
      .min(0, "As despesas não podem ser negativas."),

    dependentes: z.coerce
      .number({
        error: "Introduza um número.",
      })
      .int("O número de dependentes deve ser inteiro.")
      .min(0)
      .max(20),

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

    situacao_emprego: z.enum(
      [
        "empregado",
        "desempregado",
        "autonomo",
        "estudante",
        "reformado",
      ],
      {
        error: "Seleccione a situação de emprego.",
      }
    ),

    tem_conta_bancaria: z.boolean(),

    tem_historico_credito: z.boolean(),

    score_credito: z.coerce
      .number({
        error: "Introduza um valor numérico.",
      })
      .int("O score de crédito deve ser um número inteiro.")
      .min(0)
      .max(1000)
      .optional(),

    objectivo_financeiro: z.enum(
      [
        "credito_pessoal",
        "credito_habitacao",
        "credito_negocio",
        "seguro_vida",
        "seguro_saude",
        "seguro_automovel",
      ],
      {
        error: "Seleccione o objectivo financeiro.",
      }
    ),
  })
  .refine(
    (data) => data.despesas_mensais < data.rendimento_mensal,
    {
      message:
        "As despesas não podem ser superiores ao rendimento.",
      path: ["despesas_mensais"],
    }
  );

export type PerfilFinanceiroFormValues =
  z.infer<typeof perfilFinanceiroSchema>;