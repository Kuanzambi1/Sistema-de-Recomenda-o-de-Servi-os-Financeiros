"use client";

import React, { useEffect, useState } from "react";
import Text from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Save, AlertTriangle, SlidersHorizontal, Check, Info } from "lucide-react";
import { adminService } from "@/services/admin.service";

const SLIDERS = [
  { key: "rendimento" as const, label: "Rácio Rendimento / Mínimo Exigido", desc: "Peso do rácio entre o rendimento do utilizador e o rendimento mínimo do serviço." },
  { key: "historico_credito" as const, label: "Histórico de Crédito", desc: "Peso dado a utilizadores com histórico de crédito registado." },
  { key: "conta_bancaria" as const, label: "Conta Bancária Ativa", desc: "Peso dado a utilizadores com conta bancária ativa." },
  { key: "score_alto" as const, label: "Score de Crédito Alto (>700)", desc: "Peso para scores acima de 700 pontos." },
  { key: "score_medio" as const, label: "Score de Crédito Médio (500–700)", desc: "Peso para scores entre 500 e 700 pontos." },
  { key: "seguro" as const, label: "Adequação a Seguros", desc: "Bónus para produtos de seguro em perfis sem histórico." },
  { key: "microcredito" as const, label: "Microcrédito (Renda Baixa)", desc: "Bónus para microcrédito em rendimentos abaixo de 100.000 Kz." },
];

type Pesos = Record<string, number>;

export default function RegrasRiscoPage() {
  const [pesos, setPesos] = useState<Pesos | null>(null);
  const [regras, setRegras] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const config = await adminService.obterRisco();
        setPesos(config.pesos);
        setRegras(config.regras);
      } catch (err: any) {
        setError(err?.message ?? "Erro ao carregar a configuração de risco.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  const total = Object.values(pesos ?? {}).reduce((a, b) => a + b, 0);
  const isValid = (pesos ?? {}) && total <= 100;

  const salvar = async () => {
    setError(null);
    setSaving(true);
    try {
      await adminService.actualizarRisco({ pesos });
      setSaved(true);
    } catch (err: any) {
      setError(err?.message ?? "Ocorreu um erro ao guardar.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Text as="h1" className="text-3xl font-bold tracking-tight text-foreground">
          Modelos de Risco e Regras
        </Text>
        <Text className="text-muted-foreground mt-1 text-sm">
          Ajuste os pesos da heurística de recomendação quando o motor de IA está indisponível (fallback).
        </Text>
      </div>

      <Card className="bg-card/40 backdrop-blur-sm border-border/50 overflow-hidden shadow-sm">
        {error && (
          <div className="flex items-center gap-2 p-4 border-b border-destructive/20 bg-destructive/10 text-sm text-destructive">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="rounded-xl bg-card border border-border overflow-hidden !rounded-none !border-0">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Pesos do Algoritmo de Match (Fallback)</h2>
              <p className="text-xs text-muted-foreground">A soma dos pesos não deve exceder 100%</p>
            </div>
            <div className={`ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold ${isValid ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-red-400/10 border-red-400/20 text-red-400"}`}>
              {total}% / 100%
            </div>
          </div>

          <div className="p-6 flex flex-col gap-7">
            {SLIDERS.map(s => (
              <div key={s.key} className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                  <span className="text-2xl font-bold tabular-nums text-blue-400">{pesos?.[s.key] ?? 0}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    value={pesos?.[s.key] ?? 0}
                    onChange={(e) => setPesos({ ...pesos!, [s.key]: Number(e.target.value) })}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full h-1.5 rounded-full appearance-none bg-muted cursor-pointer"
                    style={{ accentColor: "rgb(59 130 246)" }}
                  />
                </div>
                <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500 transition-all duration-300" style={{ width: `${pesos?.[s.key] ?? 0}%` }} />
                </div>
              </div>
            ))}

            <div className="rounded-xl bg-blue-500/5 border border-blue-500/20 p-4 flex items-start gap-3 text-xs text-muted-foreground">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p>
                Os pesos têm efeito real na <strong className="text-foreground">heurística de fallback</strong> usada quando o
                serviço de IA está indisponível (RN10). A pontuação base é fixa em 50%; cada peso é um acréscimo.
                O modelo de IA treinado (regressão logística) não é alterado por esta configuração.
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {isValid
                  ? "✓ Pesos equilibrados e prontos para salvar."
                  : `⚠ A soma dos pesos (${total}%) excede o limite de 100%.`}
              </p>
              <Button className="gap-2 font-semibold" disabled={!isValid || saving} onClick={salvar}>
                {saved ? <><Check className="w-4 h-4" /> Guardado!</> : saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Salvar Modelo</>}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {regras && (
        <Card className="bg-card/40 backdrop-blur-sm border-border/50 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Regras do Motor (fixas)</h2>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Máximo de recomendações por sessão</p>
              <p className="text-2xl font-bold text-foreground mt-1">{regras.max_recomendacoes}</p>
              <p className="text-xs text-muted-foreground mt-1">Regra RN09 — o ranking nunca ultrapassa este limite.</p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Limiar mínimo de probabilidade</p>
              <p className="text-2xl font-bold text-foreground mt-1">{regras.limiar_minimo_probabilidade_pct}%</p>
              <p className="text-xs text-muted-foreground mt-1">Probabilidade mínima considerada nas recomendações.</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}