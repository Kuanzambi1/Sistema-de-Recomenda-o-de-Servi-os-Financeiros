"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Bell, Lock, Shield, ChevronRight, Camera, Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/auth.store";
import { perfilService } from "@/services/perfil.service";
import Link from "next/link";

const tabs = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "seguranca", label: "Segurança", icon: Lock },
  { id: "privacidade", label: "Privacidade", icon: Shield },
];

export default function DefinicoesPage() {
  const [activeTab, setActiveTab] = useState("perfil");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    (async () => {
      try {
        const perfil = await perfilService.obter();
        reset({
          name: user?.nome ?? "",
          email: user?.email ?? "",
          rendimento_mensal: perfil.rendimento_mensal,
          despesas_mensais: perfil.despesas_mensais,
          situacao_emprego: perfil.situacao_emprego,
          dependentes: perfil.dependentes,
          nivel_educacao: perfil.nivel_educacao,
          tem_conta_bancaria: perfil.tem_conta_bancaria,
          tem_historico_credito: perfil.tem_historico_credito,
          score_credito: perfil.score_credito,
        });
      } catch {
        // Profile may not exist yet — use auth user data
        reset({ name: user?.nome ?? "", email: user?.email ?? "" });
      } finally {
        setLoading(false);
      }
    })();
  }, [user, reset]);

  const onSubmit = async (data: any) => {
    try {
      await perfilService.atualizar({
        rendimento_mensal: Number(data.rendimento_mensal),
        despesas_mensais: Number(data.despesas_mensais),
        situacao_emprego: data.situacao_emprego,
        dependentes: Number(data.dependentes),
        nivel_educacao: data.nivel_educacao,
        tem_conta_bancaria: Boolean(data.tem_conta_bancaria),
        tem_historico_credito: Boolean(data.tem_historico_credito),
        score_credito: data.score_credito ? Number(data.score_credito) : undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // handle error
    }
  };

  const initials = user?.nome?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() ?? "U";

  return (
    <div className="flex flex-col gap-8 p-6 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">Definições</h1>
        <p className="text-muted-foreground mt-1 text-sm">Gerencie os seus dados pessoais e perfil financeiro.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex flex-col gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${isActive ? "bg-primary/15 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
                {isActive && <ChevronRight className="ml-auto w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>

        <div className="md:col-span-3 flex flex-col gap-5">
          {activeTab === "perfil" && (
            <div className="rounded-2xl border border-border bg-card p-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-5 mb-8 pb-8 border-b border-border">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">{initials}</span>
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{user?.nome ?? "Utilizador"}</h3>
                  <p className="text-sm text-muted-foreground">{user?.tipo === "utilizador" ? "Utilizador Final" : user?.tipo === "provedor" ? "Provedor" : "Admin"} • {user?.email}</p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Dados da Conta</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="name" className="text-sm">Nome</Label>
                      <Input id="name" {...register("name")} disabled className="bg-muted/50 border-border" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email" className="text-sm">E-mail</Label>
                      <Input id="email" {...register("email")} disabled className="bg-muted/50 border-border" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 mb-2">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Perfil Financeiro</h3>
                    <Button asChild variant="outline" size="sm" className="h-8 text-xs bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-300">
                      <Link href="/onboarding">Refazer Assistente IA</Link>
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="rendimento" className="text-sm">Rendimento Mensal (Kz)</Label>
                      <Input id="rendimento" type="number" {...register("rendimento_mensal")} className="bg-muted/50 border-border focus:border-primary/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="despesas" className="text-sm">Despesas Mensais (Kz)</Label>
                      <Input id="despesas" type="number" {...register("despesas_mensais")} className="bg-muted/50 border-border focus:border-primary/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="emprego" className="text-sm">Situação de Emprego</Label>
                      <select id="emprego" {...register("situacao_emprego")} className="h-10 rounded-lg border border-border bg-muted/50 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="empregado">Empregado</option>
                        <option value="autonomo">Autónomo</option>
                        <option value="desempregado">Desempregado</option>
                        <option value="reformado">Reformado</option>
                        <option value="estudante">Estudante</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="dependentes" className="text-sm">Nº de Dependentes</Label>
                      <Input id="dependentes" type="number" {...register("dependentes")} className="bg-muted/50 border-border focus:border-primary/50" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="educacao" className="text-sm">Nível de Educação</Label>
                      <select id="educacao" {...register("nivel_educacao")} className="h-10 rounded-lg border border-border bg-muted/50 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="primario">Primário</option>
                        <option value="secundario">Secundário</option>
                        <option value="licenciatura">Licenciatura</option>
                        <option value="mestrado">Mestrado</option>
                        <option value="doutoramento">Doutoramento</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="score" className="text-sm">Score de Crédito (Opcional)</Label>
                      <Input id="score" type="number" {...register("score_credito")} className="bg-muted/50 border-border focus:border-primary/50" />
                    </div>
                    <div className="flex items-center gap-3 h-10 mt-6 sm:mt-8">
                      <input id="conta" type="checkbox" {...register("tem_conta_bancaria")} className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-muted/50" />
                      <Label htmlFor="conta" className="text-sm">Tem conta bancária ativa?</Label>
                    </div>
                    <div className="flex items-center gap-3 h-10 mt-2 sm:mt-8">
                      <input id="historico" type="checkbox" {...register("tem_historico_credito")} className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-muted/50" />
                      <Label htmlFor="historico" className="text-sm">Tem histórico de crédito?</Label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button type="submit" size="sm" className={`gap-2 font-semibold transition-all ${saved ? "bg-emerald-600 hover:bg-emerald-600" : ""}`}>
                      {saved ? <><Check className="w-4 h-4" /> Guardado!</> : "Guardar Alterações"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab !== "perfil" && (
            <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center justify-center h-40 text-muted-foreground animate-in fade-in duration-200">
              <p className="text-sm">Esta secção está em construção.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
