"use client";

import React, { useState } from "react";
import Text from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Shield, CheckCircle2, Building } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function NovoUtilizadorPage() {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch } = useForm();
  
  const userType = watch("userType");

  const onSubmit = (data: any) => {
    if (step === 1) {
      setStep(2);
    } else {
      console.log("Utilizador criado:", data);
      // Aqui faria a chamada API para salvar
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
      <Link href="/utilizadores" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Voltar para Gestão</span>
      </Link>

      <div>
        <Text as="h1" className="text-3xl font-bold tracking-tight text-foreground">
          Adicionar Novo Utilizador
        </Text>
        <Text className="text-muted-foreground mt-1">
          {step === 1 ? "Passo 1/2: Informações Básicas da Conta" : "Passo 2/2: Permissões e Segurança"}
        </Text>
      </div>

      {/* Indicador de Progresso */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
        <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
      </div>

      <Card className="bg-card/40 backdrop-blur-sm border-border/50">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            
            {step === 1 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-3 md:col-span-2">
                    <Label className="text-base font-semibold">Tipo de Conta</Label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${userType === 'provedor' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted/50'}`}>
                        <input type="radio" value="provedor" {...register("userType")} className="sr-only" />
                        <Building className={`w-8 h-8 mb-2 ${userType === 'provedor' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-semibold text-foreground">Provedor de Serviço</span>
                        <span className="text-xs text-muted-foreground mt-1">Bancos, Seguradoras, etc.</span>
                      </label>
                      <label className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${userType === 'admin' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-muted/50'}`}>
                        <input type="radio" value="admin" {...register("userType")} className="sr-only" />
                        <Shield className={`w-8 h-8 mb-2 ${userType === 'admin' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="font-semibold text-foreground">Administrador</span>
                        <span className="text-xs text-muted-foreground mt-1">Acesso ao painel admin.</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Nome / Razão Social</Label>
                    <Input id="name" placeholder="Ex: Banco Nacional" {...register("name")} className="bg-muted" />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">E-mail Institucional</Label>
                    <Input id="email" type="email" placeholder="contato@empresa.ao" {...register("email")} className="bg-muted" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="nif">NIF (Opcional)</Label>
                    <Input id="nif" placeholder="5000000000" {...register("nif")} className="bg-muted" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Telemóvel / Telefone</Label>
                    <Input id="phone" type="tel" placeholder="+244 ..." {...register("phone")} className="bg-muted" />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/50">
                  <Button type="submit" className="font-bold shadow-md">
                    Continuar para Permissões
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Permissões de Acesso
                  </h3>
                  
                  <div className="p-4 bg-muted/30 border border-border/50 rounded-xl flex flex-col gap-4">
                    {userType === 'admin' ? (
                      <>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" {...register("perm_users")} className="w-4 h-4 rounded text-primary focus:ring-primary border-input" defaultChecked />
                          <div>
                            <p className="font-medium text-foreground">Gestão de Utilizadores</p>
                            <p className="text-xs text-muted-foreground">Pode criar, editar e bloquear outros usuários.</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" {...register("perm_services")} className="w-4 h-4 rounded text-primary focus:ring-primary border-input" defaultChecked />
                          <div>
                            <p className="font-medium text-foreground">Gestão Global de Serviços</p>
                            <p className="text-xs text-muted-foreground">Pode aprovar e auditar serviços de provedores.</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" {...register("perm_rules")} className="w-4 h-4 rounded text-primary focus:ring-primary border-input" />
                          <div>
                            <p className="font-medium text-foreground">Configuração de Regras de Risco</p>
                            <p className="text-xs text-muted-foreground">Pode alterar os pesos e modelos do algoritmo de recomendação.</p>
                          </div>
                        </label>
                      </>
                    ) : (
                      <>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" {...register("perm_create_service")} className="w-4 h-4 rounded text-primary focus:ring-primary border-input" defaultChecked />
                          <div>
                            <p className="font-medium text-foreground">Criação de Serviços</p>
                            <p className="text-xs text-muted-foreground">O provedor pode cadastrar novos serviços para avaliação.</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" {...register("perm_analytics")} className="w-4 h-4 rounded text-primary focus:ring-primary border-input" defaultChecked />
                          <div>
                            <p className="font-medium text-foreground">Acesso a Analíticas</p>
                            <p className="text-xs text-muted-foreground">O provedor pode visualizar métricas de desempenho.</p>
                          </div>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <Label htmlFor="password">Senha Temporária</Label>
                  <Input id="password" type="text" value="GeraD0rAuto!2026" readOnly className="bg-muted font-mono" />
                  <p className="text-xs text-muted-foreground">Esta senha será enviada por e-mail e o usuário deverá trocá-la no primeiro acesso.</p>
                </div>

                <div className="flex justify-between pt-4 border-t border-border/50">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Voltar
                  </Button>
                  <Button type="submit" className="font-bold shadow-md gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Criar Conta
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
