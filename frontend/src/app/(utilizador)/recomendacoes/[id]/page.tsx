<<<<<<< HEAD
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X, Building2, TrendingUp, Calendar, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { recomendacoesService } from "@/services/recomendacoes.service";

export default function RecomendacaoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const [rec, setRec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await recomendacoesService.obter(unwrappedParams.id);
        setRec(data);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    })();
  }, [unwrappedParams.id]);

  const handleDecision = async (aceite: boolean) => {
    setSubmitting(true);
    try {
      await recomendacoesService.decidir(unwrappedParams.id, aceite);
      router.push("/historico");
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (!rec) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Recomendação não encontrada.</p>
        <Button asChild variant="outline"><Link href="/recomendacoes">Voltar</Link></Button>
      </div>
    );
  }

  const matchPct = Math.round((rec.probabilidade_adequacao ?? 0) * 100);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/recomendacoes" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Voltar às recomendações
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">{rec.nome_servico || rec.nome}</h1>
          <div className="flex items-center gap-2 mt-2 text-muted-foreground text-sm">
            <Building2 className="w-4 h-4" />
            <span>{rec.nome_provedor}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] uppercase font-bold tracking-wider">
              {(rec.tipo_servico || rec.tipo || '')?.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-bold text-foreground leading-none">{matchPct}%</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Compatibilidade</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" /> Porque recomendamos isto?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {rec.explicacao}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Detalhes do Serviço</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {rec.descricao}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-muted/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Taxa de Juro (TAEG)</span>
                <span className="text-xl font-bold text-foreground">{rec.taxa_juro_anual}%</span>
              </div>
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-muted/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Prazo Máximo</span>
                <span className="text-xl font-bold text-foreground">{rec.prazo_maximo_meses} meses</span>
              </div>
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-muted/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Montante Máximo</span>
                <span className="text-xl font-bold text-foreground">{Number(rec.montante_maximo).toLocaleString("pt-PT")} Kz</span>
              </div>
              <div className="flex flex-col gap-1 p-4 rounded-xl bg-muted/50">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Requisito Min.</span>
                <span className="text-xl font-bold text-foreground">{Number(rec.rendimento_minimo).toLocaleString("pt-PT")} Kz</span>
              </div>
=======
"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, TrendingUp, ShieldCheck, Clock, Building2, CheckCircle } from "lucide-react"
import { mockRecomendacoes } from "@/lib/mock-data"

export default function RecomendacaoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const rec = mockRecomendacoes.find((r) => r.id === id)
  if (!rec) {
    return (
      <div className="p-10 flex flex-col items-center justify-center py-20 text-[#44474f]">
        <p className="text-lg font-medium">Recomendação não encontrada</p>
        <p className="text-sm">Esta recomendação pode ter expirado ou sido removida.</p>
      </div>
    )
  }

  const s = rec.servico
  const pct = rec.probabilidade_adequacao * 100
  const probColor = pct >= 70 ? "bg-[#16a34a]" : pct >= 40 ? "bg-[#feae2c]" : "bg-[#ba1a1a]"
  const probLabel = pct >= 70 ? "Excelente" : pct >= 40 ? "Boa" : "Razoável"

  return (
    <div className="p-10 flex flex-col gap-6 max-w-[976px]">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#44474f] text-sm hover:text-[#00163c] transition-colors w-fit cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="bg-white rounded-xl border border-[#c4c6d0] shadow-sm p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-[28px] font-bold text-[#00163c]">{s.nome}</h1>
              <span className={`${s.tipo === "credito" ? "bg-[#0f2b5b] text-[#afc6ff]" : "bg-[#2b2b40] text-[#9392ab]"} text-xs font-bold tracking-[1px] rounded px-2 py-1`}>
                {s.tipo === "credito" ? "CRÉDITO" : "SEGURO"}
              </span>
            </div>
            <p className="text-[#44474f] text-base flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {s.provedor_nome}
            </p>
          </div>
          {rec.posicao_ranking === 1 && (
            <span className="bg-[#feae2c]/20 text-[#835500] text-xs font-bold rounded-full px-3 py-1">Melhor Opção</span>
          )}
        </div>

        {/* Suitability */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#00163c]" />
            <span className="text-sm text-[#44474f]">Adequação:</span>
          </div>
          <div className="w-48 h-2 rounded-full bg-[#dce2f3]">
            <div className={`h-full rounded-full ${probColor}`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-sm font-bold text-[#00163c]">{pct}% — {probLabel}</span>
        </div>

        {/* Two-column detail */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-base font-bold text-[#00163c]">Explicação da IA</h3>
            <p className="text-[#44474f] text-sm leading-relaxed">{rec.explicacao}</p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-base font-bold text-[#00163c]">Detalhes do Produto</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailRow label="Taxa de Juro" value={`${s.taxa_juro_anual}%`} />
              <DetailRow label="Prazo" value={`${s.prazo_minimo_meses} – ${s.prazo_maximo_meses} meses`} />
              <DetailRow label="Montante" value={`${s.montante_minimo.toLocaleString()} – ${s.montante_maximo.toLocaleString()} Kz`} />
              <DetailRow label="Tipo" value={s.tipo === "credito" ? "Crédito" : "Seguro"} />
>>>>>>> 8d6439d (refactor: rename (admin) to admin, add notificacoes/provedores/recomendacoes pages, remove localStorage)
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
            <h3 className="font-bold text-foreground text-center">Decisão</h3>
            <p className="text-sm text-muted-foreground text-center mb-2">
              Aceite esta recomendação para iniciar o processo com a instituição, ou rejeite se não tiver interesse.
            </p>
            
            <Button 
              className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-12"
              onClick={() => handleDecision(true)}
              disabled={submitting || rec.aceite !== null}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
              Aceitar Proposta
            </Button>
            
            <Button 
              variant="outline"
              className="w-full gap-2 text-red-400 hover:text-red-500 hover:bg-red-400/10 border-red-400/20 font-semibold h-12"
              onClick={() => handleDecision(false)}
              disabled={submitting || rec.aceite !== null}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-5 h-5" />}
              Rejeitar
            </Button>

            {rec.aceite !== null && (
              <div className="mt-4 p-3 rounded-lg text-center text-sm font-semibold bg-muted/50">
                Já decidiu: {rec.aceite ? <span className="text-emerald-400">Aceite</span> : <span className="text-red-400">Rejeitada</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
=======
        {/* Description */}
        <div className="flex flex-col gap-2">
          <h3 className="font-heading text-base font-bold text-[#00163c]">Descrição</h3>
          <p className="text-[#44474f] text-sm leading-relaxed">{s.descricao}</p>
        </div>

        {/* Requirements */}
        <div className="flex flex-col gap-3">
          <h3 className="font-heading text-base font-bold text-[#00163c]">Requisitos de Elegibilidade</h3>
          <div className="flex flex-col gap-2">
            <ReqRow label="Rendimento mínimo" ok />
            <ReqRow label="Conta bancária" ok />
            <ReqRow label="Score de crédito mínimo" ok={false} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-[#c4c6d0]">
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-[#c4c6d0] text-[#00163c] text-sm rounded-lg px-6 py-3 hover:bg-[#f0f3ff] transition-colors cursor-pointer"
          >
            Fechar
          </button>
          <button
            type="button"
            className="bg-[#835500] text-white text-sm rounded-lg px-6 py-3 hover:bg-[#835500]/90 transition-colors cursor-pointer flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Tenho Interesse
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#f9f9ff] rounded-lg p-3 border border-[#f0f3ff]">
      <p className="text-[#747780] text-xs">{label}</p>
      <p className="text-[#00163c] text-sm font-bold mt-0.5">{value}</p>
    </div>
  )
}

function ReqRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {ok ? (
        <CheckCircle className="w-4 h-4 text-[#16a34a]" />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-[#ba1a1a] flex items-center justify-center">
          <span className="text-[#ba1a1a] text-[10px] font-bold">!</span>
        </div>
      )}
      <span className={`text-sm ${ok ? "text-[#16a34a]" : "text-[#ba1a1a]"}`}>{label}</span>
    </div>
  )
>>>>>>> 8d6439d (refactor: rename (admin) to admin, add notificacoes/provedores/recomendacoes pages, remove localStorage)
}
