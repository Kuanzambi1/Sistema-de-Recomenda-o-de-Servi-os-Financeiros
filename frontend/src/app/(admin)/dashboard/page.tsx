"use client";

import React, { useEffect, useState } from "react";
import { Users, Briefcase, AlertTriangle, Activity, Loader2, Cpu, Brain, Bot, Zap, TrendingUp, BarChart3 } from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function AdminDashboardPage() {
  const [metricas, setMetricas] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminService.metricas();
        setMetricas(data);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full bg-blue-500/5 flex items-center justify-center animate-pulse-glow-sm">
            <Brain className="w-6 h-6 text-primary" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">A carregar dados do sistema...</p>
      </div>
    );
  }

  // Parse metrics
  const totalUsers = metricas?.utilizadores?.reduce((acc: number, u: any) => acc + u.total, 0) ?? 0;
  const totalProviders = metricas?.utilizadores?.find((u: any) => u.tipo === "provedor")?.total ?? 0;
  const servicosAtivos = metricas?.servicos?.find((s: any) => s.ativo === true)?.total ?? 0;
  const recStats = metricas?.recomendacoes ?? { total: 0, aceites: 0, rejeitadas: 0, media_adequacao_pct: 0 };
  const fbStats = metricas?.feedbacks ?? { total: 0, media_nota: 0 };
  const modelo = metricas?.modelo_activo;

  const kpis = [
    { label: "Total Utilizadores", value: totalUsers.toLocaleString("pt-PT"), icon: Users, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-500/20", glow: "shadow-[0_0_20px_rgba(59,130,246,0.08)]" },
    { label: "Provedores Ativos", value: String(totalProviders), icon: Briefcase, color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-500/20", glow: "shadow-[0_0_20px_rgba(139,92,246,0.08)]" },
    { label: "Serviços Ativos", value: String(servicosAtivos), icon: Activity, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/20", glow: "shadow-[0_0_20px_rgba(16,185,129,0.08)]" },
    { label: "Recomendações Geradas", value: String(recStats.total), icon: BarChart3, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-500/20", glow: "shadow-[0_0_20px_rgba(245,158,11,0.08)]" },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground flex items-center gap-3">
            Dashboard Administrativo
            <Cpu className="w-6 h-6 text-blue-400/50" />
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Dados reais da plataforma em tempo real.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Sistema Online</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`rounded-xl glass-card p-5 transition-all hover:-translate-y-0.5 hover:border-white/15 ${kpi.glow} scan-line-effect`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center border ${kpi.border} transition-transform hover:scale-110 duration-300`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <div className={`w-2 h-2 rounded-full ${kpi.color === 'text-blue-400' ? 'bg-blue-400' : kpi.color === 'text-violet-400' ? 'bg-violet-400' : kpi.color === 'text-emerald-400' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} style={{boxShadow: `0 0 8px currentColor`}} />
              </div>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-foreground mt-1">{kpi.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Recommendation stats */}
        <div className="lg:col-span-3 rounded-xl glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-foreground">Estatísticas de Recomendações</h2>
          </div>
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 scan-line-effect">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Aceites</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">{recStats.aceites}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 scan-line-effect">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Rejeitadas</p>
              <p className="text-xl font-bold text-red-400 mt-1">{recStats.rejeitadas}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 scan-line-effect">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Média Adequação</p>
              <p className="text-xl font-bold text-foreground mt-1">{recStats.media_adequacao_pct}%</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 scan-line-effect">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Feedbacks</p>
              <p className="text-xl font-bold text-foreground mt-1">{fbStats.total} <span className="text-xs font-normal text-muted-foreground">(⭐ {fbStats.media_nota})</span></p>
            </div>
          </div>
        </div>

        {/* Model status — Futuristic AI Command Panel */}
        <div className="lg:col-span-2 rounded-xl glass-card overflow-hidden neon-border">
          <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Motor de IA</h2>
            {modelo && (
              <span className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                v{modelo.versao}
              </span>
            )}
          </div>
          <div className="p-5 flex flex-col gap-5 relative">
            {/* Subtle background effect */}
            <div className="absolute inset-0 ai-grid-bg opacity-20 pointer-events-none" />
            <div className="absolute inset-0 animate-data-stream opacity-10 pointer-events-none" />
            
            <div className="relative z-10">
              {modelo ? (
                <>
                  {/* AI Status Orb */}
                  <div className="flex items-center justify-center mb-5">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-[15px]" />
                      <div className="absolute inset-0 rounded-full border border-blue-500/15 animate-[spin_10s_linear_infinite]" />
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-600/15 to-violet-600/15 flex items-center justify-center border border-white/10 animate-pulse-glow-sm">
                        <Bot className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </div>

                  {/* Accuracy bar */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" /> Acurácia
                      </span>
                      <span className="font-bold text-emerald-400">{(modelo.acuracia * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full animate-fill-bar" 
                        style={{ "--fill-width": `${modelo.acuracia * 100}%` } as React.CSSProperties} 
                      />
                    </div>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">F1 Score</p>
                      <p className="text-xl font-bold text-foreground mt-1">{(modelo.f1_score * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Amostras</p>
                      <p className="text-xl font-bold text-foreground mt-1">{modelo.amostras_treino}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center py-4 gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/5 border-dashed flex items-center justify-center">
                    <Brain className="w-5 h-5 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">Nenhum modelo ativo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
