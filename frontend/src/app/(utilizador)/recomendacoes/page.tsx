"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, ShieldCheck, Star, Zap, Sparkles, RefreshCw, Loader2, Brain, Bot, Activity, Cpu } from "lucide-react";
import Link from "next/link";
import { recomendacoesService } from "@/services/recomendacoes.service";
import { useAuthStore } from "@/store/auth.store";

// Icon map by service type
const typeIcons: Record<string, { icon: React.ElementType; gradient: string; iconBg: string; glow: string; accent: string }> = {
  conta_poupanca:     { icon: TrendingUp, gradient: "from-emerald-500/20 to-emerald-500/5", iconBg: "bg-emerald-500/15 text-emerald-400", glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]", accent: "#10B981" },
  investimento:       { icon: TrendingUp, gradient: "from-emerald-500/20 to-emerald-500/5", iconBg: "bg-emerald-500/15 text-emerald-400", glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]", accent: "#10B981" },
  seguro_vida:        { icon: ShieldCheck, gradient: "from-blue-500/20 to-blue-500/5", iconBg: "bg-blue-500/15 text-blue-400", glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]", accent: "#3B82F6" },
  seguro_saude:       { icon: ShieldCheck, gradient: "from-blue-500/20 to-blue-500/5", iconBg: "bg-blue-500/15 text-blue-400", glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]", accent: "#3B82F6" },
  seguro_automovel:   { icon: ShieldCheck, gradient: "from-blue-500/20 to-blue-500/5", iconBg: "bg-blue-500/15 text-blue-400", glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]", accent: "#3B82F6" },
  credito_pessoal:    { icon: Star, gradient: "from-violet-500/20 to-violet-500/5", iconBg: "bg-violet-500/15 text-violet-400", glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]", accent: "#8B5CF6" },
  credito_habitacao:  { icon: Star, gradient: "from-amber-500/20 to-amber-500/5", iconBg: "bg-amber-500/15 text-amber-400", glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]", accent: "#F59E0B" },
  microcredito:       { icon: Star, gradient: "from-pink-500/20 to-pink-500/5", iconBg: "bg-pink-500/15 text-pink-400", glow: "hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]", accent: "#EC4899" },
};

const defaultStyle = { icon: Star, gradient: "from-blue-500/20 to-blue-500/5", iconBg: "bg-blue-500/15 text-blue-400", glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]", accent: "#3B82F6" };

export default function RecomendacoesPage() {
  const user = useAuthStore((s) => s.user);
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recomendacoesService.listar();
      setRecs(data);
    } catch (err: any) {
      setError(err?.message ?? "Erro ao carregar recomendações.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      await recomendacoesService.gerar();
      await fetchRecs();
    } catch (err: any) {
      setError(err?.message ?? "Erro ao gerar recomendações.");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => { fetchRecs(); }, []);

  return (
    <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero section */}
      <div className="relative rounded-2xl overflow-hidden glass-card p-8 gradient-line-top">
        <div className="absolute inset-0 ai-grid-bg opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/20">
                <Brain className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">Motor de IA</span>
              </div>
              {/* AI status indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-foreground mb-2">
              Olá, <span className="gradient-text">{user?.nome ?? "Utilizador"}</span> 👋
            </h1>
            <p className="text-muted-foreground text-base max-w-lg">
              {recs.length > 0
                ? <>Encontrámos <strong className="text-foreground">{recs.length} serviços financeiros</strong> com alta compatibilidade para o seu perfil.</>
                : "Gere novas recomendações personalizadas com base no seu perfil financeiro."
              }
            </p>
            <div className="mt-6">
              <Button onClick={handleGenerate} disabled={generating} className="gap-2 font-semibold scan-line-effect">
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                {generating ? "IA a processar..." : "Gerar Novas Recomendações"}
              </Button>
            </div>
          </div>

          {/* AI Orb indicator (desktop) */}
          <div className="hidden md:block relative w-28 h-28 shrink-0">
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-[25px]" />
            <div className="absolute inset-0 rounded-full border border-blue-500/10 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-blue-600/15 to-violet-600/15 flex items-center justify-center border border-white/10 animate-pulse-glow-sm">
              <Bot className="w-8 h-8 text-blue-400/70" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{"--orbit-radius": "52px"} as React.CSSProperties}>
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[spin_3s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full bg-blue-500/5 flex items-center justify-center animate-pulse-glow-sm">
              <Brain className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">A consultar motor de IA...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && recs.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full bg-muted-foreground/5 blur-[20px]" />
            <div className="absolute inset-0 rounded-full border border-white/5 border-dashed" />
            <div className="absolute inset-3 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/5">
              <Brain className="w-8 h-8 text-muted-foreground/30" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-foreground mb-1">Motor de IA em Standby</h2>
          <p className="text-muted-foreground text-sm max-w-md">
            Certifique-se de que o seu perfil financeiro está preenchido e clique em &ldquo;Gerar Novas Recomendações&rdquo; para ativar o motor preditivo.
          </p>
        </div>
      )}

      {/* Cards grid */}
      {!loading && recs.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">As Suas Recomendações</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Ordenadas por compatibilidade com o seu perfil</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full glass-card text-blue-400">
                <Brain className="w-3 h-3" /> Analisado pela IA
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full border border-border text-muted-foreground">
                {recs.length} resultados
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recs.map((rec, index) => {
              const style = typeIcons[rec.tipo_servico] ?? defaultStyle;
              const Icon = style.icon;
              const matchPct = Math.round((rec.probabilidade_adequacao ?? 0) * 100);

              return (
                <div
                  key={rec.id}
                  className={`group relative flex flex-col rounded-2xl glass-card overflow-hidden transition-all duration-300 ${style.glow} hover:border-white/15 hover:-translate-y-1 scan-line-effect`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Top gradient line */}
                  <div className={`h-px w-full bg-gradient-to-r ${style.gradient.replace('/5', '').replace('/20', '/60')}`} />
                  <div className={`absolute inset-0 bg-gradient-to-b ${style.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />

                  <div className="relative z-10 p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${style.iconBg} transition-transform group-hover:scale-110 duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-2xl font-bold text-foreground leading-none">{matchPct}%</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" style={{color: style.accent}} /> Match IA
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: style.accent }}>
                      {rec.nome_provedor}
                    </p>
                    <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">{rec.nome_servico}</h3>

                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5 line-clamp-3">
                      {rec.explicacao}
                    </p>

                    {/* Compatibility bar */}
                    <div className="mb-5">
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full animate-fill-bar" 
                          style={{ 
                            "--fill-width": `${matchPct}%`,
                            background: `linear-gradient(90deg, ${style.accent}80, ${style.accent})` 
                          } as React.CSSProperties} 
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                        {rec.tipo_servico?.replace('_', ' ')}
                      </span>
                      {rec.taxa_juro_anual > 0 && (
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                          {rec.taxa_juro_anual}% taxa
                        </span>
                      )}
                    </div>

                    <Button asChild className="w-full gap-2 font-semibold group/btn" size="sm">
                      <Link href={`/recomendacoes/${rec.id}`}>
                        Ver Detalhes
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
