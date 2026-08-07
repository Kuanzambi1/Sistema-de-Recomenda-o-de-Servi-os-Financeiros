"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, AlertTriangle, Play, SlidersHorizontal, Zap } from "lucide-react";

export default function RegrasRiscoPage() {
  const [weights, setWeights] = useState({ income: 40, risk: 35, age: 15, history: 10 });
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  const isValid = total === 100;

  const sliders = [
    { key: "income" as const, label: "Renda e Capacidade Financeira", desc: "Peso dado ao salário, patrimônio e liquidez do usuário.", color: "accent-blue-500", bar: "bg-blue-500", text: "text-blue-400" },
    { key: "risk" as const, label: "Tolerância ao Risco", desc: "Alinhamento do perfil do usuário com o risco do serviço.", color: "accent-emerald-500", bar: "bg-emerald-500", text: "text-emerald-400" },
    { key: "age" as const, label: "Faixa Etária e Momento de Vida", desc: "Adequação do produto à idade e objetivos de longo prazo.", color: "accent-violet-500", bar: "bg-violet-500", text: "text-violet-400" },
    { key: "history" as const, label: "Histórico de Crédito (Score)", desc: "Score de crédito e restrições de fontes externas.", color: "accent-amber-500", bar: "bg-amber-500", text: "text-amber-400" },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">Modelos de Risco e Regras</h1>
        <p className="text-muted-foreground mt-1 text-sm">Ajuste os pesos e parâmetros do motor de IA para as recomendações financeiras.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders */}
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Pesos do Algoritmo de Match</h2>
                <p className="text-xs text-muted-foreground">A soma dos pesos deve totalizar 100%</p>
              </div>
              {/* Total counter */}
              <div className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold ${isValid ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-red-400/10 border-red-400/20 text-red-400"}`}>
                {total}% / 100%
              </div>
            </div>

            <div className="p-6 flex flex-col gap-7">
              {sliders.map(s => (
                <div key={s.key} className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                    <span className={`text-2xl font-bold tabular-nums ${s.text}`}>{weights[s.key]}%</span>
                  </div>
                  {/* Custom styled range */}
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      value={weights[s.key]}
                      onChange={(e) => setWeights({ ...weights, [s.key]: Number(e.target.value) })}
                      min={0}
                      max={100}
                      step={1}
                      className={`w-full h-1.5 rounded-full appearance-none bg-muted cursor-pointer ${s.color}`}
                      style={{ accentColor: s.bar.replace("bg-", "").startsWith("#") ? s.bar.replace("bg-", "") : undefined }}
                    />
                  </div>
                  {/* Distribution bar */}
                  <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${s.bar} transition-all duration-300`} style={{ width: `${weights[s.key]}%` }} />
                  </div>
                </div>
              ))}

              {/* Save */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {isValid
                    ? "✓ Pesos balanceados e prontos para salvar."
                    : `⚠ Faltam ${100 - total}% para completar 100%.`}
                </p>
                <Button className="gap-2 font-semibold" disabled={!isValid}>
                  <Save className="w-4 h-4" />
                  Salvar Modelo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Side cards */}
        <div className="flex flex-col gap-4">
          {/* Danger */}
          <div className="rounded-xl bg-card border border-red-400/20 overflow-hidden">
            <div className="px-5 py-4 border-b border-red-400/20 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-semibold text-red-400">Modo Estrito</h2>
            </div>
            <div className="p-5">
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Quando ativado, bloqueia <strong className="text-foreground">automaticamente</strong> recomendações de alto risco para utilizadores classificados como <strong className="text-foreground">Conservadores</strong>.
              </p>
              <Button variant="outline" className="w-full text-red-400 border-red-400/30 hover:bg-red-400/10 font-semibold text-sm">
                Ativar Modo Estrito
              </Button>
            </div>
          </div>

          {/* Simulator */}
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <Play className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Simulador</h2>
            </div>
            <div className="p-5">
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                Simule os pesos atuais com um perfil de utilizador para ver as recomendações geradas.
              </p>
              <select className="w-full h-9 rounded-lg border border-border bg-muted/30 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary mb-3">
                <option>Jovem Universitário (Renda Baixa)</option>
                <option>Executivo Sênior (Conservador)</option>
                <option>Empreendedor (Arrojado)</option>
              </select>
              <Button className="w-full gap-2 text-sm font-semibold">
                <Zap className="w-4 h-4" />
                Rodar Simulação
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
