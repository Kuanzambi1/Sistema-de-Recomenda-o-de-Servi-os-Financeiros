"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, LockKeyhole, ArrowRight, Sparkles, Loader2, Brain, Bot, ShieldCheck, Cpu, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/lib/schemas/auth.schema";
import Link from "next/link";
import { useState } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormValues) {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(data);
      setAuth(res.token, res.utilizador);

      if (res.utilizador.tipo === "utilizador") router.push("/recomendacoes");
      else if (res.utilizador.tipo === "provedor") router.push("/servicos");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message ?? "Erro ao iniciar sessão.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#0A0D14] selection:bg-primary/30">
      {/* Background Effects */}
      <div className="absolute inset-0 ai-grid-bg opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex w-full max-w-5xl mx-4 z-10 animate-in zoom-in-95 fade-in duration-700">
        
        {/* Left Panel — Neural Network Visualization (desktop only) */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1 p-12 rounded-l-3xl glass-card border-r-0 relative overflow-hidden">
          <div className="absolute inset-0 ai-grid-bg opacity-50" />
          <div className="absolute inset-0 animate-data-stream opacity-30" />
          
          {/* Neural Brain Visualization */}
          <div className="relative w-52 h-52 mb-10">
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-[40px]" />
            
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border border-blue-500/15 animate-[spin_30s_linear_infinite]" />
            <div className="absolute inset-4 rounded-full border border-violet-500/10 border-dashed animate-[spin_25s_linear_infinite_reverse]" />
            
            {/* Center orb */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-blue-600/20 to-violet-600/20 flex items-center justify-center animate-pulse-glow border border-white/10">
              <Brain className="w-16 h-16 text-blue-400/80" />
            </div>
            
            {/* Orbiting nodes */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{"--orbit-radius": "100px"} as React.CSSProperties}>
              <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-reverse" style={{"--orbit-radius": "85px"} as React.CSSProperties}>
              <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit-slow" style={{"--orbit-radius": "95px"} as React.CSSProperties}>
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
            </div>
          </div>

          <div className="relative z-10 text-center">
            <h2 className="text-2xl font-bold font-heading text-white mb-3">
              Sistema de IA <span className="gradient-text">Preditiva</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-8">
              O nosso motor de Machine Learning analisa o seu perfil e recomenda os melhores serviços financeiros com precisão.
            </p>

            {/* Feature pills */}
            <div className="flex flex-col gap-3">
              {[
                { icon: Cpu, text: "Análise em tempo real", color: "text-blue-400" },
                { icon: ShieldCheck, text: "Dados 100% encriptados", color: "text-emerald-400" },
                { icon: Activity, text: "Precisão de 94.2%", color: "text-violet-400" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-sm">
                  <f.icon className={`w-4 h-4 ${f.color} shrink-0`} />
                  <span className="text-white/80 font-medium">{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Powered by ML badge */}
          <div className="mt-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Powered by Machine Learning</span>
          </div>
        </div>

        {/* Right Panel — Login Form */}
        <div className="w-full lg:w-[480px] glass-card lg:rounded-l-none rounded-3xl lg:rounded-r-3xl p-8 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          <div className="w-full max-w-sm flex flex-col items-center gap-8">
            {/* Logo + Title */}
            <div className="text-center">
              <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-[0_0_25px_rgba(37,99,235,0.3)] mb-6 hover:scale-105 transition-transform animate-pulse-glow-sm">
                <span className="text-white font-bold text-2xl font-heading tracking-tighter">S</span>
              </Link>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white font-heading">
                Bem-vindo(a) de volta
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Introduza os seus dados para aceder à plataforma
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5 relative z-10">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-in slide-in-from-top-2 fade-in">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-muted-foreground font-medium text-xs uppercase tracking-wider">
                  E-mail
                </Label>
                <div className="relative group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@exemplo.com"
                    className="w-full h-12 pl-11 rounded-xl border border-white/10 bg-[#0A0D14]/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-white transition-all group-hover:border-white/20"
                    {...register("email")}
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5 group-focus-within:text-blue-400 transition-colors" />
                </div>
                {errors?.email && (
                  <span className="text-red-400 text-xs font-medium">{errors.email.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-muted-foreground font-medium text-xs uppercase tracking-wider">
                    Palavra-passe
                  </Label>
                  <Link href="#" className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Esqueceu-se?
                  </Link>
                </div>
                <div className="relative group">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-12 pl-11 rounded-xl border border-white/10 bg-[#0A0D14]/50 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 text-white transition-all group-hover:border-white/20"
                    {...register("password")}
                  />
                  <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4.5 h-4.5 group-focus-within:text-blue-400 transition-colors" />
                </div>
                {errors?.password && (
                  <span className="text-red-400 text-xs font-medium">{errors.password.message}</span>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all glow-blue group scan-line-effect"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="w-4.5 h-4.5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">ou</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <div className="text-center mt-2">
                <span className="text-sm text-muted-foreground">Novo por aqui? </span>
                <Link href="/register" className="text-sm font-bold text-white hover:text-blue-400 transition-colors border-b border-transparent hover:border-blue-400 pb-0.5">
                  Criar uma conta
                </Link>
              </div>
            </form>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/60 mt-8">
            <ShieldCheck className="w-3.5 h-3.5" /> Acesso 100% Seguro e Encriptado
          </div>
        </div>
      </div>
    </div>
  );
}
