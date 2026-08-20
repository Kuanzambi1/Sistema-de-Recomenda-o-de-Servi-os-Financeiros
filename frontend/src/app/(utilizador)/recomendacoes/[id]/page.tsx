"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X, Building2, Info, Loader2, Star, Send, SkipForward } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { recomendacoesService } from "@/services/recomendacoes.service";
import { feedbacksService } from "@/services/feedbacks.service";
import { cn } from "@/lib/utils";

const likertLabels: Record<number, string> = {
  1: "Muito mau",
  2: "Mau",
  3: "Neutro",
  4: "Bom",
  5: "Excelente",
};

export default function RecomendacaoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  const router = useRouter();
  const [rec, setRec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [jaAvaliado, setJaAvaliado] = useState(false);
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [util, setUtil] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [feedbackErro, setFeedbackErro] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await recomendacoesService.obter(unwrappedParams.id);
        setRec(data);
        const meus = await feedbacksService.listarMeus();
        setJaAvaliado(meus.some((f) => f.recomendacao_id === unwrappedParams.id));
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
      setRec((prev: any) => ({ ...prev, aceite }));
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedback = async () => {
    if (nota < 1) return;
    setEnviando(true);
    setFeedbackErro(null);
    try {
      await feedbacksService.submeter({
        recomendacao_id: unwrappedParams.id,
        nota_likert: nota as 1 | 2 | 3 | 4 | 5,
        comentario: comentario.trim() || undefined,
        util,
      });
      setJaAvaliado(true);
    } catch (err: any) {
      setFeedbackErro(err?.message ?? "Erro ao guardar a avaliação.");
    } finally {
      setEnviando(false);
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
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] uppercase font-bold tracking-wider">
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
              className="w-full gap-2 bg-primary/60 hover:bg-primary/70 text-primary-foreground font-semibold h-12"
              onClick={() => handleDecision(true)}
              disabled={submitting || rec.aceite !== null}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-5 h-5" />}
              Aceitar Proposta
            </Button>
            
            <Button 
              variant="outline"
              className="w-full gap-2 text-primary hover:text-primary/80 hover:bg-primary/10 border border-primary/20 font-semibold h-12"
              onClick={() => handleDecision(false)}
              disabled={submitting || rec.aceite !== null}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-5 h-5" />}
              Rejeitar
            </Button>

            {rec.aceite !== null && !submitting && (
              <div className="mt-4 p-3 rounded-lg text-center text-sm font-semibold bg-muted/50">
                Já decidiu: {rec.aceite ? <span className="text-emerald-400">Aceite</span> : <span className="text-red-400">Rejeitada</span>}
              </div>
            )}
          </div>

          {rec.aceite !== null && !submitting && (
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
              {jaAvaliado ? (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <h3 className="font-bold text-foreground">Avaliação registada</h3>
                  <p className="text-sm text-muted-foreground">
                    Obrigado! O seu feedback ajuda a melhorar as recomendações futuras.
                  </p>
                  <Button asChild className="w-full gap-2 font-semibold">
                    <Link href="/historico">Ver Histórico</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-foreground text-center flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" /> Como avalia esta recomendação?
                  </h3>

                  <div className="flex items-center justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setNota(i)}
                        aria-label={`${i} estrela${i > 1 ? "s" : ""}`}
                        className={cn(
                          "p-1.5 rounded-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                          i <= nota ? "scale-110" : "opacity-60"
                        )}
                      >
                        <Star className={cn("w-7 h-7 transition-colors", i <= nota ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
                      </button>
                    ))}
                  </div>

                  <p className="text-center text-xs text-muted-foreground min-h-[16px]">
                    {nota > 0 ? likertLabels[nota] : "Toque nas estrelas para avaliar"}
                  </p>

                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Comentário (opcional) — o que achou desta recomendação?"
                    maxLength={500}
                    rows={3}
                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none dark:bg-input/30"
                  />

                  <button
                    type="button"
                    onClick={() => setUtil((v) => !v)}
                    className={cn(
                      "flex items-center gap-2 self-center px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors",
                      util
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Check className={cn("w-3.5 h-3.5", !util && "opacity-40")} />
                    {util ? "Foi útil" : "Não foi útil"}
                  </button>

                  {feedbackErro && (
                    <p className="text-xs text-destructive text-center">{feedbackErro}</p>
                  )}

                  <Button
                    className="w-full gap-2 font-semibold h-10"
                    onClick={handleFeedback}
                    disabled={enviando || nota < 1}
                  >
                    {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Guardar avaliação
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full gap-2 text-muted-foreground font-medium h-9"
                    onClick={() => router.push("/historico")}
                  >
                    <SkipForward className="w-4 h-4" />
                    Saltar e ver histórico
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
