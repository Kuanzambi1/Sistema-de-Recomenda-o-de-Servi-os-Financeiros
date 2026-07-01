"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Text from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, LockKeyhole, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerSchema } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormValues) {
    setLoading(true);
    setApiError(null);

    try {
      const response = await authService.register({
        nome: data.nome,
        email: data.email,
        password: data.password,
      });
      setAuth(response.token, response.user);
      localStorage.setItem("srf_token", response.token);
      router.push("/onboarding");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? ((err as { response: { data: { message: string } } }).response?.data?.message ?? "Erro ao criar conta.")
          : "Erro ao criar conta. Tente novamente.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-4 pt-[124px]">
      <div className="flex flex-col items-center gap-8 z-10">
        <div className="text-center">
          <Text as="h1" className="text-[32px] font-semibold leading-tight tracking-tight text-foreground">
            Crie a sua conta
          </Text>
        </div>

        <div className="w-full max-w-[440px] bg-card rounded-xl shadow-lg p-8 flex flex-col items-center gap-6 border border-border">
          {apiError && (
            <div className="w-full p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium text-center">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nome" className="text-muted-foreground font-medium">
                Nome Completo
              </Label>
              <div className="relative">
                <Input
                  id="nome"
                  type="text"
                  placeholder="Emanuel Kwanzambi"
                  className="w-full h-12 pl-10 rounded-lg border border-input bg-muted focus:border-primary focus:ring-primary"
                  {...register("nome")}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
              {errors?.nome && (
                <span className="text-destructive text-xs">{errors.nome.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-muted-foreground font-medium">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="example@mail.com"
                  className="w-full h-12 pl-10 rounded-lg border border-input bg-muted focus:border-primary focus:ring-primary"
                  {...register("email")}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
              {errors?.email && (
                <span className="text-destructive text-xs">{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-muted-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 rounded-lg border border-input bg-muted focus:border-primary focus:ring-primary"
                  {...register("password")}
                />
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
              {errors?.password && (
                <span className="text-destructive text-xs">{errors.password.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword" className="text-muted-foreground font-medium">
                Confirmar Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 rounded-lg border border-input bg-muted focus:border-primary focus:ring-primary"
                  {...register("confirmPassword")}
                />
                <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
              {errors?.confirmPassword && (
                <span className="text-destructive text-xs">{errors.confirmPassword.message}</span>
              )}
            </div>

            <div className="flex items-start gap-3">
              <Checkbox id="terms" className="mt-0.5" />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-5">
                Eu aceito os{" "}
                <a href="#" className="text-secondary-800 font-medium hover:underline">
                  Termos de Serviço
                </a>{" "}
                e a{" "}
                <a href="#" className="text-secondary-800 font-bold hover:underline">
                  Política de Privacidade
                </a>{" "}
                do SRF.
              </Label>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 font-bold shadow-md hover:opacity-90 transition-all">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  A criar conta...
                </>
              ) : (
                <>
                  Criar Conta
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">Já tem conta? </span>
          <a href="login" className="text-sm font-bold text-secondary-800 hover:text-primary transition-colors">
            Entrar
          </a>
        </div>
      </div>
    </div>
  );
}
