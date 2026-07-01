"use client";

import Text from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, LockKeyhole, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/lib/schemas/auth.schema";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormValues) {
    console.log("submit", data);
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden px-4">
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none"
        style={{ top: "-102px", right: "-50px" }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none"
        style={{ bottom: "-50px", left: "-128px" }}
      />

      <div className="flex flex-col items-center gap-8 z-10">
        <div className="text-center">
          <Text as="h1" className="text-[32px] font-semibold leading-tight tracking-tight text-foreground">
            Seja Benvindo(a) a melhor
          </Text>
          <Text className="text-sm text-muted-foreground mt-2">
            Plataforma de Recomendações Financeiras
          </Text>
        </div>

        <div className="w-full max-w-[440px] bg-card rounded-xl shadow-lg p-8 flex flex-col items-center gap-6 border border-border">
          <span className="font-heading text-[28px] font-bold text-primary">SRF</span>

          <Text className="text-sm text-muted-foreground text-center">
            Faça login para acessar suas recomendações
          </Text>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-muted-foreground font-medium">
                E-mail institucional
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@example.com"
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
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-muted-foreground font-medium">
                  Password
                </Label>
                <a href="#" className="text-sm text-secondary-800 hover:text-primary font-medium transition-colors">
                  Esqueceu a password?
                </a>
              </div>
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

            <Button type="submit" className="w-full h-12 font-bold shadow-md hover:opacity-90 transition-all">
              Entrar
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-sm text-muted-foreground">ou</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">Ainda não tem conta? </span>
              <a href="register" className="text-sm font-bold text-secondary-800 hover:text-primary transition-colors">
                Registar-se
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
