"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { servicosService } from "@/services/servicos.service";
import type { ServicoFinanceiro, TipoServico } from "@/types";

export default function EditarServicoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const svc = await servicosService.obter(id);
        reset({
          nome: svc.nome,
          tipo: svc.tipo,
          descricao: svc.descricao,
          taxa_juro_anual: svc.taxa_juro_anual,
          prazo_minimo_meses: svc.prazo_minimo_meses,
          prazo_maximo_meses: svc.prazo_maximo_meses,
          montante_minimo: svc.montante_minimo,
          montante_maximo: svc.montante_maximo,
          rendimento_minimo: svc.rendimento_minimo,
          score_credito_minimo: svc.score_credito_minimo,
          requer_conta_bancaria: svc.requer_conta_bancaria ? "true" : "false",
        });
      } catch {
        setError("Erro ao carregar o serviço.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    setError(null);
    try {
      await servicosService.atualizar(id, {
        nome: data.nome,
        tipo: data.tipo as TipoServico,
        descricao: data.descricao,
        taxa_juro_anual: Number(data.taxa_juro_anual),
        prazo_minimo_meses: Number(data.prazo_minimo_meses),
        prazo_maximo_meses: Number(data.prazo_maximo_meses),
        montante_minimo: Number(data.montante_minimo),
        montante_maximo: Number(data.montante_maximo),
        rendimento_minimo: Number(data.rendimento_minimo),
        score_credito_minimo: Number(data.score_credito_minimo),
        requer_conta_bancaria: data.requer_conta_bancaria === "true",
      });
      router.push("/servicos");
    } catch (err: any) {
      setError(err?.message ?? "Erro ao actualizar serviço.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/servicos" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Voltar aos serviços
      </Link>

      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">Editar Serviço</h1>
        <p className="text-muted-foreground mt-1 text-sm">Actualize as informações do produto financeiro.</p>
      </div>

      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nome">Nome do Serviço *</Label>
              <Input id="nome" required placeholder="Ex: Crédito Automóvel Plus" {...register("nome")} className="bg-muted/30 border-border focus:border-primary/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipo">Tipo de Serviço *</Label>
              <select id="tipo" required {...register("tipo")} className="h-10 rounded-lg border border-border bg-muted/30 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="credito_pessoal">Crédito Pessoal</option>
                <option value="credito_habitacao">Crédito Habitação</option>
                <option value="microcredito">Microcrédito</option>
                <option value="seguro_vida">Seguro de Vida</option>
                <option value="seguro_saude">Seguro de Saúde</option>
                <option value="seguro_automovel">Seguro Automóvel</option>
                <option value="conta_poupanca">Conta Poupança</option>
                <option value="investimento">Investimento</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <textarea id="descricao" required rows={3} placeholder="Descreva as vantagens e condições gerais..." {...register("descricao")} className="rounded-lg border border-border bg-muted/30 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">Condições Financeiras</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="taxa">Taxa de Juro Anual (%) *</Label>
              <Input id="taxa" type="number" step="0.1" min="0" required placeholder="0.0" {...register("taxa_juro_anual")} className="bg-muted/30 border-border focus:border-primary/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="montante_min">Montante Mínimo (Kz) *</Label>
              <Input id="montante_min" type="number" min="0" required placeholder="0" {...register("montante_minimo")} className="bg-muted/30 border-border focus:border-primary/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="montante_max">Montante Máximo (Kz) *</Label>
              <Input id="montante_max" type="number" min="0" required placeholder="0" {...register("montante_maximo")} className="bg-muted/30 border-border focus:border-primary/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prazo_min">Prazo Mínimo (Meses) *</Label>
              <Input id="prazo_min" type="number" min="1" required placeholder="12" {...register("prazo_minimo_meses")} className="bg-muted/30 border-border focus:border-primary/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prazo_max">Prazo Máximo (Meses) *</Label>
              <Input id="prazo_max" type="number" min="1" required placeholder="60" {...register("prazo_maximo_meses")} className="bg-muted/30 border-border focus:border-primary/50" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="font-semibold text-foreground border-b border-border pb-2">Requisitos de Elegibilidade</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="rend_min">Rendimento Mínimo (Kz) *</Label>
              <Input id="rend_min" type="number" min="0" required defaultValue="0" {...register("rendimento_minimo")} className="bg-muted/30 border-border focus:border-primary/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="score_min">Score Crédito Mínimo (0-1000) *</Label>
              <Input id="score_min" type="number" min="0" max="1000" required defaultValue="0" {...register("score_credito_minimo")} className="bg-muted/30 border-border focus:border-primary/50" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="conta">Requer Conta Bancária?</Label>
              <select id="conta" {...register("requer_conta_bancaria")} className="h-10 rounded-lg border border-border bg-muted/30 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                <option value="false">Não obrigatório</option>
                <option value="true">Sim, obrigatório</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-2">
          <Button type="button" variant="ghost" asChild>
            <Link href="/servicos">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={submitting} className="gap-2 font-semibold min-w-[160px]">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {submitting ? "A guardar..." : "Guardar Alterações"}
          </Button>
        </div>
      </form>
    </div>
  );
}
