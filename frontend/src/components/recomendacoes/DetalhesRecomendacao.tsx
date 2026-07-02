"use client";

import { useState, useEffect } from "react";
import { Recomendacao, PerfilFinanceiro } from "@/types";
import { mockPerfilFinanceiro } from "@/lib/mock-perfil";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { recomendacoesService } from "@/services/recomendacoes.service";
import {
  CircleCheck,
  CircleAlert,
  X,
  Sparkles,
  Landmark,
  Building2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) =>
  `${value.toLocaleString("pt-AO")} Kz`;

const formatScoreLabel = (score: number): string => {
  if (score >= 0.9) return "Excelente";
  if (score >= 0.75) return "Muito Bom";
  if (score >= 0.6) return "Bom";
  if (score >= 0.4) return "Razoável";
  return "Baixo";
};

interface ValidationItem {
  id: string;
  status: "success" | "warning" | "error";
  text: string;
}

function buildValidations(
  perfil: PerfilFinanceiro,
  servico: Recomendacao["servico"]
): ValidationItem[] {
  const items: ValidationItem[] = [];

  if (servico.rendimento_minimo > 0) {
    const passed = perfil.rendimento_mensal >= servico.rendimento_minimo;
    items.push({
      id: "rendimento",
      status: passed ? "success" : "error",
      text: `O seu rendimento (${formatCurrency(perfil.rendimento_mensal)}) está ${
        passed ? "acima do" : "abaixo do"
      } mínimo exigido (${formatCurrency(servico.rendimento_minimo)})`,
    });
  }

  if (servico.requer_conta_bancaria) {
    items.push({
      id: "conta",
      status: perfil.tem_conta_bancaria ? "success" : "error",
      text: perfil.tem_conta_bancaria
        ? "Tem conta bancária conforme exigido"
        : "Não tem conta bancária exigida",
    });
  }

  if (servico.score_credito_minimo > 0) {
    const gap = servico.score_credito_minimo - perfil.score_credito;
    const status =
      gap <= 0 ? "success" : gap <= 50 ? "warning" : "error";
    items.push({
      id: "score",
      status,
      text:
        gap <= 0
          ? `O seu score de crédito (${perfil.score_credito}) atende ao mínimo exigido (${servico.score_credito_minimo})`
          : gap <= 50
            ? `O seu score de crédito (${perfil.score_credito}) está próximo do mínimo (${servico.score_credito_minimo})`
            : `O seu score de crédito (${perfil.score_credito}) está abaixo do mínimo exigido (${servico.score_credito_minimo})`,
    });
  }

  return items;
}

interface DetalhesRecomendacaoProps {
  recomendacao: Recomendacao;
  open: boolean;
  onClose: () => void;
  onInteresse?: (id: string) => void;
}

export default function DetalhesRecomendacao({
  recomendacao,
  open,
  onClose,
  onInteresse,
}: DetalhesRecomendacaoProps) {
  const { servico, probabilidade_adequacao, explicacao } = recomendacao;
  const [loading, setLoading] = useState(false);
  const [interessado, setInteressado] = useState(false);

  const perfil = mockPerfilFinanceiro;
  const isCredito = servico.tipo === "credito";
  const progressPercent = Math.min(probabilidade_adequacao * 100, 100);
  const formattedScore = (probabilidade_adequacao * 100).toFixed(0);
  const scoreLabel = formatScoreLabel(probabilidade_adequacao);
  const validations = buildValidations(perfil, servico);

  useEffect(() => {
    if (!open) {
      setInteressado(false);
      setLoading(false);
    }
  }, [open]);

  const handleInteresse = async () => {
    setLoading(true);
    try {
      await recomendacoesService.marcarInteresse(recomendacao.id);
      setInteressado(true);
      onInteresse?.(recomendacao.id);
    } catch {
      setInteressado(false);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const statRows: { label: string; value: string }[] = [
    {
      label: "Taxa de juro anual",
      value: isCredito ? `${servico.taxa_juro_anual}% a.a.` : "—",
    },
    {
      label: "Prazo",
      value:
        servico.prazo_maximo_meses > 0
          ? `${servico.prazo_minimo_meses} a ${servico.prazo_maximo_meses} meses`
          : `A partir de ${servico.prazo_minimo_meses} meses`,
    },
    {
      label: "Montante",
      value:
        servico.montante_maximo > 0
          ? `${(servico.montante_minimo / 1000).toFixed(0)}.000 – ${(servico.montante_maximo / 1000).toFixed(0)}.000 Kz`
          : `${servico.montante_minimo.toLocaleString("pt-AO")} Kz`,
    },
    {
      label: "Rendimento mínimo",
      value:
        servico.rendimento_minimo > 0
          ? formatCurrency(servico.rendimento_minimo)
          : "—",
    },
    {
      label: "Score de crédito mínimo",
      value:
        servico.score_credito_minimo > 0
          ? servico.score_credito_minimo.toString()
          : "—",
    },
    {
      label: "Requer conta bancária",
      value: servico.requer_conta_bancaria ? "Sim" : "Não",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "#00163C66" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-[896px] bg-white rounded-xl shadow-[0_12px_28px_rgba(15,43,91,0.12)] max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-border">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center border border-border">
              {isCredito ? (
                <Landmark className="w-7 h-7 text-primary" />
              ) : (
                <Building2 className="w-7 h-7 text-primary" />
              )}
            </div>
            <div className="flex flex-col">
              <h2 className="font-heading text-2xl font-bold text-primary">
                {servico.nome}
              </h2>
              {servico.provedor_nome && (
                <span className="text-base text-muted-foreground">
                  {servico.provedor_nome}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-[14px] h-[14px]" />
          </button>
        </div>

        {/* ── Suitability Bar ── */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-end justify-between mb-2">
            <span className="text-xs font-medium tracking-[0.7px] text-[#44474F] uppercase">
              Probabilidade de aprovação
            </span>
            <span
              className="font-heading text-2xl font-bold"
              style={{ color: "#835500" }}
            >
              {formattedScore}% — {scoreLabel}
            </span>
          </div>
          <div className="w-full h-4 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-foreground to-secondary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: AI Insight */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-[22px] h-[22px] text-foreground" />
              <h3 className="font-heading text-lg font-semibold text-foreground">
                Análise SRF AI
              </h3>
            </div>
            <div className="rounded-xl bg-[#F0F3FF] border border-[#C4C6D080] p-4">
              <p className="text-base text-[#151C27] leading-relaxed">
                {explicacao}
              </p>
            </div>
          </div>

          {/* Right: Technical Table */}
          <Card className="border border-border overflow-hidden">
            <div className="bg-muted px-4 py-2">
              <span className="text-xs font-medium tracking-[0.28px] text-muted-foreground uppercase">
                Detalhes do Produto
              </span>
            </div>
            <div className="divide-y divide-border">
              {statRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-4 py-[16.5px]"
                >
                  <span className="text-sm md:text-base text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="text-sm md:text-base text-foreground text-right">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Requisitos Section ── */}
        <div className="px-6 pb-8">
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Requisitos e Validação
            </h3>
            <div className="flex flex-col gap-3">
              {validations.map((v) => (
                <div
                  key={v.id}
                  className={cn(
                    "flex items-center gap-4 px-4 py-[17px] rounded-lg border",
                    v.status === "success" && "bg-white border-border",
                    v.status === "warning" &&
                      "bg-[#FEAE2C0D] border-[#83550033]",
                    v.status === "error" && "bg-destructive/5 border-destructive/20"
                  )}
                >
                  {v.status === "success" && (
                    <CircleCheck className="w-5 h-5 shrink-0 text-green-600" />
                  )}
                  {v.status === "warning" && (
                    <CircleAlert className="w-5 h-5 shrink-0" style={{ color: "#835500" }} />
                  )}
                  {v.status === "error" && (
                    <CircleAlert className="w-5 h-5 shrink-0 text-destructive" />
                  )}
                  <span className="text-base text-[#151C27] leading-relaxed">
                    {v.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button
            onClick={handleInteresse}
            disabled={loading || interessado}
            variant={interessado ? "outline" : "default"}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : interessado ? (
              "Interesse registado"
            ) : (
              "Tenho interesse"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
