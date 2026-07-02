"use client";

import { useState } from "react";
import { Recomendacao } from "@/types";
import { recomendacoesService } from "@/services/recomendacoes.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ChevronRight,
  CircleCheck,
  Building2,
  Briefcase,
  Landmark,
  Heart,
  HeartPulse,
  Car,
  Loader2,
} from "lucide-react";

const TIPO_ICONS: Record<string, typeof Building2> = {
  credito: Landmark,
  credito_pessoal: Landmark,
  credito_habitacao: Building2,
  credito_negocio: Briefcase,
  seguro: HeartPulse,
  seguro_vida: Heart,
  seguro_saude: HeartPulse,
  seguro_automovel: Car,
};

interface RecommendationCardProps {
  recomendacao: Recomendacao;
  isBest?: boolean;
  onVerDetalhes?: (id: string) => void;
  onInteresse?: (id: string) => void;
}

export default function RecommendationCard({ recomendacao, isBest, onVerDetalhes, onInteresse }: RecommendationCardProps) {
  const { id, servico, probabilidade_adequacao, explicacao } = recomendacao;
  const [interessado, setInteressado] = useState(false);
  const [loading, setLoading] = useState(false);

  const progressPercent = Math.min(probabilidade_adequacao * 100, 100);
  const formattedScore = (probabilidade_adequacao * 100).toFixed(0);

  const isCredito = servico.tipo === "credito";

  const handleInteresse = async () => {
    setLoading(true);
    try {
      await recomendacoesService.marcarInteresse(id);
      setInteressado(true);
      onInteresse?.(id);
    } catch {
      setInteressado(false);
    } finally {
      setLoading(false);
    }
  };

  const stat1Label = isCredito ? "Taxa de Juro" : "Cobertura";
  const stat1Value = isCredito ? `${servico.taxa_juro_anual}% a.a.` : "Internacional";
  const stat2Label = isCredito ? "Prazo" : "Beneficiários";
  const stat2Value = servico.prazo_maximo_meses
    ? `${servico.prazo_minimo_meses} a ${servico.prazo_maximo_meses} m`
    : "Até 5 pessoas";
  const stat3Label = isCredito ? "Montante" : "Prémio";
  const formatKz = (n: number) => n.toLocaleString("pt-AO");
  const stat3Value = servico.montante_maximo
    ? `${(servico.montante_minimo / 1000).toFixed(0)}k – ${(servico.montante_maximo / 1000).toFixed(0)}M Kz`
    : `${formatKz(servico.montante_minimo)} Kz`;

  const IconComponent = TIPO_ICONS[servico.tipo] || Landmark;

  return (
    <Card
      className={`relative p-6 flex flex-col gap-4 w-full transition-all ${
        isBest
          ? "border-2 border-secondary bg-secondary/[0.06] shadow-lg"
          : "border border-border bg-muted"
      }`}
    >
      {isBest && (
        <div className="absolute top-0 right-0">
          <div className="flex items-center gap-1 bg-secondary text-secondary-foreground font-bold text-sm px-5 py-1 rounded-bl-xl rounded-tr-xl">
            <Sparkles className="w-3 h-3" />
            Melhor Opção
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[0.625rem] font-bold tracking-[0.6px] uppercase ${
              isCredito
                ? "bg-primary/10 text-primary"
                : "bg-muted-foreground/10 text-muted-foreground"
            }`}
          >
            <IconComponent className="w-3 h-3" />
            {servico.tipo === "credito" ? "CRÉDITO" : "SEGURO"}
          </span>
          {servico.provedor_nome && (
            <span className="text-xs text-muted-foreground">{servico.provedor_nome}</span>
          )}
        </div>
        <h3 className="font-heading text-2xl font-bold text-primary break-words">{servico.nome}</h3>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Match</span>
          <span className="text-foreground font-semibold">{formattedScore}%</span>
        </div>
        <div
          className="relative w-full h-2 rounded-full bg-muted-foreground/20 overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/30">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{stat1Label}</span>
          <span className="text-base font-bold text-foreground">{stat1Value}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{stat2Label}</span>
          <span className="text-base font-bold text-foreground">{stat2Value}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{stat3Label}</span>
          <span className="text-base font-bold text-foreground">{stat3Value}</span>
        </div>
      </div>

      {explicacao && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted">
          <CircleCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-foreground leading-relaxed">{explicacao}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => onVerDetalhes?.(id)}
          className="flex items-center gap-1 text-primary font-bold text-sm hover:underline"
        >
          Ver detalhes
          <ChevronRight className="w-4 h-4" />
        </button>
        <Button
          type="button"
          onClick={handleInteresse}
          disabled={loading || interessado}
          variant={interessado ? "outline" : "default"}
          size="lg"
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
    </Card>
  );
}
