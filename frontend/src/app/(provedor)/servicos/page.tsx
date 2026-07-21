"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, Users, MoreHorizontal, Loader2, BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";
import { servicosService } from "@/services/servicos.service";
import { useAuthStore } from "@/store/auth.store";

export default function MeusServicosPage() {
  const user = useAuthStore((s) => s.user);
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginacao, setPaginacao] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await servicosService.listar();
        setServicos(result.data);
        setPaginacao(result);
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const ativos = servicos.filter(s => s.ativo).length;

  const kpis = [
    { label: "Total de Serviços", value: String(paginacao?.total ?? servicos.length), icon: BarChart3, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Serviços Ativos", value: String(ativos), icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Provedor", value: user?.nome ?? "-", icon: Users, color: "text-violet-400", bg: "bg-violet-400/10" },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Os Meus Serviços</h1>
          <p className="text-muted-foreground mt-1 text-sm">Gerencie os seus produtos financeiros na plataforma SRF.</p>
        </div>
        <Button asChild className="gap-2 font-semibold">
          <Link href="/servicos/novo"><Plus className="w-4 h-4" />Criar Novo Serviço</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="rounded-xl bg-card border border-border p-5 flex items-center gap-4 hover:border-white/15 transition-all">
              <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <h3 className="text-xl font-bold text-foreground">{kpi.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      )}

      {!loading && (
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Todos os Serviços</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-muted-foreground uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="px-5 py-3 font-medium">Nome</th>
                  <th className="px-5 py-3 font-medium">Tipo</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Taxa Juro</th>
                  <th className="px-5 py-3 font-medium">Rend. Min.</th>
                  <th className="px-5 py-3 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {servicos.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">Nenhum serviço encontrado.</td></tr>
                )}
                {servicos.map((svc, i) => (
                  <tr key={svc.id} className={`group transition-colors hover:bg-white/3 ${i !== servicos.length - 1 ? "border-b border-border" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-foreground">{svc.nome}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{svc.id?.slice(0, 8)}</div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{svc.tipo?.replace('_', ' ')}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${svc.ativo ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-muted-foreground bg-muted border-border"}`}>
                        {svc.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{svc.taxa_juro_anual}%</td>
                    <td className="px-5 py-4 text-muted-foreground">{Number(svc.rendimento_minimo).toLocaleString("pt-PT")} Kz</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground" asChild>
                          <Link href={`/servicos/${svc.id}/editar`}><Settings2 className="w-3.5 h-3.5" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {paginacao && (
            <div className="px-5 py-3 border-t border-border bg-muted/10 text-xs text-muted-foreground">
              {paginacao.total} serviços • Página {paginacao.page} de {Math.ceil(paginacao.total / paginacao.per_page)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
