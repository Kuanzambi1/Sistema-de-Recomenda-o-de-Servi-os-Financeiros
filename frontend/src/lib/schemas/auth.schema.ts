import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O email é obrigatório.")
    .pipe(z.email("Introduza um email válido.")),
  password: z
    .string()
    .min(6, "A password deve ter pelo menos 6 caracteres."),
});

export const registerSchema = z
  .object({
    nome: z
      .string()
      .min(2, "O nome deve ter pelo menos 2 caracteres.")
      .max(150, "O nome não pode exceder 150 caracteres."),
    email: z
      .string()
      .min(1, "O email é obrigatório.")
      .pipe(z.email("Introduza um email válido.")),
    password: z
      .string()
      .min(6, "A password deve ter pelo menos 6 caracteres.")
      .max(100, "A password não pode exceder 100 caracteres."),
    confirmPassword: z.string().min(1, "Confirme a sua password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As passwords não coincidem.",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;