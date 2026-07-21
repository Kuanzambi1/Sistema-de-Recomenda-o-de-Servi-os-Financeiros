"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X, Building2, Info, Loader2 } from "lucide-react";
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
      if (aceite) {
        await recomendacoesService.aceitar(unwrappedParams.id);
      }
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
          <h1 className="text-3xl font-bold font-heading text-foreground">{rec.nome_servico || rec.nome}</h1>
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
            </div>
          </div>
        </div>

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
}
