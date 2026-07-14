"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Users, BarChart3, TrendingUp, Activity, Zap } from "lucide-react";

const kpis = [
  { label: "Total Visualizações", value: "45.231", delta: "+12.5%", positive: true, icon: Activity, glow: "bg-blue-400/10 text-blue-400", border: "hover:border-blue-400/20" },
  { label: "Novas Adesões (Mês)", value: "1.240", delta: "+8.2%", positive: true, icon: Users, glow: "bg-emerald-400/10 text-emerald-400", border: "hover:border-emerald-400/20" },
  { label: "Taxa de Conversão", value: "2.74%", delta: "-1.1%", positive: false, icon: BarChart3, glow: "bg-red-400/10 text-red-400", border: "hover:border-red-400/20" },
  { label: "CAC (Custo Aquisição)", value: "Kz 4.500", delta: "-5.4%", positive: true, icon: TrendingUp, glow: "bg-amber-400/10 text-amber-400", border: "hover:border-amber-400/20" },
];

const topServices = [
  { name: "Conta Poupança Premium", percent: 78, color: "bg-emerald-500" },
  { name: "Cartão de Crédito Black", percent: 45, color: "bg-blue-500" },
  { name: "Seguro Vida Top", percent: 32, color: "bg-violet-500" },
];

export default function AnaliticaPage() {
  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">Analítica e Performance</h1>
        <p className="text-muted-foreground mt-1 text-sm">Acompanhe o desempenho das suas ofertas e taxas de conversão de usuários.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`rounded-xl bg-card border border-border p-5 transition-all ${kpi.border} hover:shadow-lg hover:shadow-black/20`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${kpi.glow} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${kpi.positive ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"}`}>
                  {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.delta}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-foreground">{kpi.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main chart */}
        <div className="lg:col-span-2 rounded-xl bg-card border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Evolução de Adesões</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Últimos 6 meses</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground"><span className="w-2 h-2 rounded-full bg-blue-500" />Visualizações</span>
              <span className="flex items-center gap-1.5 text-muted-foreground"><span className="w-2 h-2 rounded-full bg-emerald-500" />Conversões</span>
            </div>
          </div>
          {/* Chart placeholder with visual grid */}
          <div className="relative h-72 p-5 flex items-end gap-3">
            {[40, 65, 55, 80, 72, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col gap-1 items-center">
                <div className="w-full flex flex-col gap-1">
                  <div className="w-full rounded-t-md bg-blue-500/20 border border-blue-500/30 transition-all hover:bg-blue-500/30" style={{ height: `${h * 1.8}px` }} />
                  <div className="w-full rounded-t-md bg-emerald-500/20 border border-emerald-500/30 transition-all hover:bg-emerald-500/30" style={{ height: `${h * 0.6}px` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top services */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Top Serviços</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Por compatibilidade média</p>
          </div>
          <div className="p-5 flex flex-col gap-5">
            {topServices.map((svc, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">{svc.name}</span>
                  <span className="text-sm font-bold text-foreground">{svc.percent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${svc.color} transition-all duration-700`}
                    style={{ width: `${svc.percent}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Insight card */}
            <div className="mt-2 p-4 rounded-xl bg-primary/8 border border-primary/15 flex items-start gap-3">
              <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Conta Poupança</strong> tem a maior taxa de match com utilizadores conservadores.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
