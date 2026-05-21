import { z } from "zod";

export const servicoFinanceiroSchema = z
  .object({
    nome: z
      .string()
      .min(2, "O nome deve ter pelo menos 2 caracteres.")
      .max(200, "O nome não pode exceder 200 caracteres."),

    tipo: z.enum(["credito", "seguro"], {
      error: "Seleccione o tipo de serviço.",
    }),

    descricao: z
      .string()
      .min(10, "A descrição deve ter pelo menos 10 caracteres."),

    taxa_juro_anual: z.coerce
      .number({
        error: "Introduza um valor numérico.",
      })
      .min(0, "A taxa não pode ser negativa.")
      .max(25, "A taxa não pode exceder 25% (limite BNA)."),

    prazo_minimo_meses: z.coerce
      .number({
        error: "Introduza um número.",
      })
      .int("O prazo deve ser um número inteiro.")
      .min(6, "O prazo mínimo é 6 meses (RN04)."),

    prazo_maximo_meses: z.coerce
      .number({
        error: "Introduza um número.",
      })
      .int("O prazo deve ser um número inteiro.")
      .min(6),

    montante_minimo: z.coerce
      .number({
        error: "Introduza um valor.",
      })
      .min(0),

    montante_maximo: z.coerce
      .number({
        error: "Introduza um valor.",
      })
      .min(0),

    rendimento_minimo: z.coerce
      .number({
        error: "Introduza um valor.",
      })
      .min(
        50000,
        "O rendimento mínimo é 50.000 Kz (RN02)."
      ),

    score_credito_minimo: z.coerce
      .number({
        error: "Introduza um valor.",
      })
      .int("O score deve ser um número inteiro.")
      .min(0)
      .max(1000),

    requer_conta_bancaria: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (
      data.prazo_maximo_meses <
      data.prazo_minimo_meses
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "O prazo máximo deve ser igual ou superior ao prazo mínimo.",
        path: ["prazo_maximo_meses"],
      });
    }

    if (
      data.montante_maximo <
      data.montante_minimo
    ) {
      ctx.addIssue({
        code: "custom",
        message:
          "O montante máximo deve ser igual ou superior ao mínimo.",
        path: ["montante_maximo"],
      });
    }
  });

export type ServicoFinanceiroFormValues =
  z.infer<typeof servicoFinanceiroSchema>;