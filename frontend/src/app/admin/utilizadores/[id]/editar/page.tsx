"use client";

import React, { useEffect, useState } from "react";
import Text from "@/components/ui/text";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { adminService } from "@/services/admin.service";

export default function EditarUtilizadorPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string) ?? "";

  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const user = await adminService.obterUtilizador(id);
        reset({
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
        });
      } catch (err: any) {
        setError(err?.response?.data?.erro || err?.message || "Erro ao carregar o utilizador.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    setError("");
    try {
      await adminService.actualizarUtilizador(id, {
        nome: data.nome,
        email: data.email,
        tipo: data.tipo,
      });
      router.push("/admin/utilizadores");
    } catch (err: any) {
      setError(err?.response?.data?.erro || err?.message || "Ocorreu um erro ao actualizar o utilizador.");
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
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto w-full animate-in fade-in duration-500">
      <Link href="/admin/utilizadores" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Voltar para Gestão</span>
      </Link>

      <div>
        <Text as="h1" className="text-3xl font-bold tracking-tight text-foreground">
          Editar Utilizador
        </Text>
        <Text className="text-muted-foreground mt-1">
          Actualize as informações da conta.
        </Text>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      <Card className="bg-card/40 backdrop-blur-sm border-border/50">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-3">
                <Label htmlFor="nome">Nome / Razão Social</Label>
                <Input id="nome" placeholder="Ex: Banco Nacional" {...register("nome")} className="bg-muted" />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="email">E-mail Institucional</Label>
                <Input id="email" type="email" placeholder="contato@empresa.ao" {...register("email")} className="bg-muted" />
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="tipo">Tipo de Conta</Label>
                <select id="tipo" {...register("tipo")} className="h-8 w-full min-w-0 rounded-lg border border-border bg-muted px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-primary/20 md:text-sm">
                  <option value="utilizador">Utilizador</option>
                  <option value="provedor">Provedor de Serviço</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/50">
              <Button type="button" variant="outline" className="mr-3" onClick={() => router.push("/admin/utilizadores")}>
                Cancelar
              </Button>
              <Button type="submit" className="font-bold shadow-md gap-2" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Guardar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}