"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, LockKeyhole, ArrowRight, User, CheckCircle2, Loader2, AlertCircle, Brain, Bot, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerSchema } from "@/lib/schemas/auth.schema";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormValues) {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.register({
        nome: data.nome,
        email: data.email,
        password: data.password,
      });

      setAuth(res.token, res.utilizador);

      if (res.utilizador.tipo === "utilizador") router.push("/onboarding");
      else if (res.utilizador.tipo === "provedor") router.push("/servicos");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Erro ao criar conta.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#0A0D14] selection:bg-primary/30">
      {/* Background Effects */}
      <div className="absolute inset-0 ai-grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-violet-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex w-full max-w-5xl mx-4 z-10 animate-in zoom-in-95 fade-in duration-700">

        {/* Left Panel — Registration Form */}
        <div className="w-full lg:w-[520px] glass-card rounded-3xl lg:rounded-r-none p-8 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          
          <div className="w-full max-w-sm flex flex-col gap-6">
            {/* Logo + Title */}
            <div className="text-left">
              <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-[0_0_25px_rgba(139,92,246,0.3)] mb-6 hover:scale-105 transition-transform animate-pulse-glow-sm">
                <span className="text-white font-bold text-2xl font-heading tracking-tighter">S</span>
              </Link>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white font-heading">
                Criar Conta
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Preencha os dados abaixo e comece a receber recomendações inteligentes.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5 relative z-10">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-left flex items-center gap-2 font-medium animate-in slide-in-from-top-2 fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="nome" className="text-muted-foreground font-medium text-xs uppercase tracking-wider">
                  Nome Completo
                </Label>
                <div className="relative group">
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Ex: João da Silva"
                    className="w-full h-12 pl-11 rounded-xl border border-white/10 bg-[#0A0D14]/50 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 text-white transition-all group-hover:border-white/20"
                    {...register("nome")}
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5 group-focus-within:text-violet-400 transition-colors" />
                </div>
                {errors?.nome && (
                  <span className="text-red-400 text-xs font-medium">{errors.nome.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-muted-foreground font-medium text-xs uppercase tracking-wider">
                  E-mail
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    className="w-full h-12 pl-11 rounded-xl border border-white/10 bg-[#0A0D14]/50 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 text-white transition-all group-hover:border-white/20"
                    {...register("email")}
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5 group-focus-within:text-violet-400 transition-colors" />
                </div>
                {errors?.email && (
                  <span className="text-red-400 text-xs font-medium">{errors.email.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-muted-foreground font-medium text-xs uppercase tracking-wider">
                  Palavra-passe
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-12 pl-11 rounded-xl border border-white/10 bg-[#0A0D14]/50 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 text-white transition-all group-hover:border-white/20"
                    {...register("password")}
                  />
                  <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5 group-focus-within:text-violet-400 transition-colors" />
                </div>
                {errors?.password && (
                  <span className="text-red-400 text-xs font-medium">{errors.password.message}</span>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-90 shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all glow-blue group scan-line-effect"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Registar Agora
                    <ArrowRight className="w-4.5 h-4.5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="text-center mt-4">
                <span className="text-sm text-muted-foreground">Já tem uma conta? </span>
                <Link href="/login" className="text-sm font-bold text-white hover:text-violet-400 transition-colors border-b border-transparent hover:border-violet-400 pb-0.5">
                  Iniciar Sessão
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Panel — AI Value Proposition (desktop only) */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1 p-12 rounded-r-3xl glass-card border-l-0 relative overflow-hidden">
          <div className="absolute inset-0 ai-grid-bg opacity-50" />
          <div className="absolute inset-0 animate-data-stream opacity-20" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Shield / Security Visualization */}
            <div className="relative w-44 h-44 mb-10">
              <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-[40px]" />
              <div className="absolute inset-0 rounded-full border border-violet-500/15 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-blue-500/10 border-dashed animate-[spin_25s_linear_infinite_reverse]" />
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-violet-600/20 to-blue-600/20 flex items-center justify-center animate-pulse-glow border border-white/10">
                <ShieldCheck className="w-14 h-14 text-violet-400/80" />
              </div>
              {/* Orbiting nodes */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{"--orbit-radius": "85px"} as React.CSSProperties}>
                <div className="w-2.5 h-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-reverse" style={{"--orbit-radius": "75px"} as React.CSSProperties}>
                <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              </div>
            </div>

            <h2 className="text-2xl font-bold font-heading text-white mb-3">
              O primeiro passo para a sua <span className="gradient-text">liberdade financeira.</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-8">
              Crie a sua conta gratuita e deixe a inteligência artificial encontrar os melhores serviços para si.
            </p>

            {/* Benefits */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
              {[
                { icon: Brain, text: "Análise de perfil instantânea", color: "text-blue-400" },
                { icon: Zap, text: "Matches com alta probabilidade", color: "text-amber-400" },
                { icon: ShieldCheck, text: "Privacidade total dos seus dados", color: "text-emerald-400" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-sm">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0 border border-white/5">
                    <f.icon className={`w-3.5 h-3.5 ${f.color}`} />
                  </div>
                  <span className="text-white/80 font-medium">{f.text}</span>
                </div>
              ))}
            </div>

            {/* Badge */}
            <div className="mt-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
              <Bot className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">Protegido por IA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
