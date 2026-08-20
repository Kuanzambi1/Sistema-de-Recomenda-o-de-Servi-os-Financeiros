"use client";

import React, { useEffect, useState } from "react";
import Text from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, CheckCircle2, Ban, Pause, Play, Settings2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { adminService } from "@/services/admin.service";

const TIPOS = [
  "credito_pessoal",
  "credito_habitacao",
  "microcredito",
  "seguro_vida",
  "seguro_saude",
  "seguro_automovel",
  "conta_poupanca",
  "investimento",
];

const STATUS: Record<string, { label: string; chip: string }> = {
  pendente: { label: "Em Revisão", chip: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  ativo: { label: "Ativo", chip: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  pausado: { label: "Pausado", chip: "text-slate-400 bg-slate-400/10 border-slate-400/20" },
  suspenso: { label: "Suspenso", chip: "text-red-400 bg-red-400/10 border-red-400/20" },
};

interface ServicoGlobal {
  id: string;
  nome: string;
  tipo: string;
  estado: string;
  ativo: boolean;
  taxa_juro_anual: number;
  nome_provedor?: string;
  score_auditoria?: number;
}

export default function GestaoGlobalServicosPage() {
  const [servicos, setServicos] = useState<ServicoGlobal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string | undefined>(undefined);
  const [tipoFilter, setTipoFilter] = useState<string | undefined>(undefined);
  const [pagina, setPagina] = useState(1);
  const [paginacao, setPaginacao] = useState<any>(null);
  const [accionando, setAccionando] = useState<string | null>(null);

  const carregar = async (estado?: string, tipo?: string, q?: string, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.listarServicos({ estado, tipo, q, pagina: page, limite: 20 });
      setServicos(data.servicos);
      setPaginacao(data.paginacao);
    } catch (err: any) {
      setError(err?.message ?? "Erro ao carregar os serviços.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar(estadoFilter, tipoFilter, search, pagina);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoFilter, tipoFilter, pagina]);

  const aplicarEstado = async (svc: ServicoGlobal, estado: string) => {
    setAccionando(svc.id);
    try {
      await adminService.aplicarEstadoServico(svc.id, estado);
      await carregar(estadoFilter, tipoFilter, search, pagina);
    } finally {
      setAccionando(null);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Text as="h1" className="text-3xl font-bold tracking-tight text-foreground">
          Gestão Global de Serviços
        </Text>
        <Text className="text-muted-foreground mt-1">
          Aprove novos produtos, faça auditoria de qualidade e suspenda serviços que violam as regras.
        </Text>
      </div>

      <Card className="bg-card/40 backdrop-blur-sm border-border/50 overflow-hidden shadow-sm">
        <div className="p-4 flex flex-col lg:flex-row gap-3 justify-between items-center border-b border-border/50 bg-muted/20">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, provedor..."
              className="pl-9 bg-background border-border/50"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPagina(1); }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[undefined, "pendente", "ativo", "pausado", "suspenso"].map((e) => (
              <button
                key={e ?? "todos"}
                onClick={() => { setEstadoFilter(e); setPagina(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  estadoFilter === e
                    ? "bg-primary/15 border-primary/30 text-primary"
                    : "bg-muted border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {e === undefined ? "Todos" : STATUS[e].label}
              </button>
            ))}
            <select
              value={tipoFilter ?? ""}
              onChange={(e) => { setTipoFilter(e.target.value || undefined); setPagina(1); }}
              className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Todos os tipos</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 border-b border-destructive/20 bg-destructive/10 text-sm text-destructive">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Serviço / ID</th>
                  <th className="px-6 py-4 font-medium">Provedor</th>
                  <th className="px-6 py-4 font-medium">Tipo</th>
                  <th className="px-6 py-4 font-medium">Estado de Aprovação</th>
                  <th className="px-6 py-4 font-medium">Audit Score</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {servicos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                      Nenhum serviço encontrado.
                    </td>
                  </tr>
                )}
                {servicos.map((svc) => {
                  const st = STATUS[svc.estado] ?? STATUS.pendente;
                  return (
                    <tr key={svc.id} className="hover:bg-accent/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{svc.nome}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 font-mono">{svc.id?.slice(0, 8)}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-medium">{svc.nome_provedor}</td>
                      <td className="px-6 py-4 text-muted-foreground">{svc.tipo?.replace(/_/g, " ")}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`font-medium border ${st.chip}`}>
                          {st.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${(svc.score_auditoria ?? 0) >= 80 ? "text-emerald-500" : (svc.score_auditoria ?? 0) >= 50 ? "text-amber-500" : "text-muted-foreground"}`}>
                          {svc.score_auditoria ?? 0}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild title="Editar">
                            <Link href={`/servicos/${svc.id}/editar`}><Settings2 className="w-3.5 h-3.5" /></Link>
                          </Button>
                          {svc.estado === "pendente" && (
                            <Button
                              size="sm" className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                              disabled={accionando === svc.id}
                              onClick={() => aplicarEstado(svc, "ativo")}
                            >
                              {accionando === svc.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              Aprovar
                            </Button>
                          )}
                          {svc.estado === "ativo" && (
                            <Button size="sm" variant="outline" className="h-8 gap-1" disabled={accionando === svc.id} onClick={() => aplicarEstado(svc, "pausado")}>
                              <Pause className="w-3.5 h-3.5" /> Pausar
                            </Button>
                          )}
                          {svc.estado === "pausado" && (
                            <Button size="sm" variant="outline" className="h-8 gap-1 text-emerald-400" disabled={accionando === svc.id} onClick={() => aplicarEstado(svc, "ativo")}>
                              <Play className="w-3.5 h-3.5" /> Retomar
                            </Button>
                          )}
                          {(svc.estado === "ativo" || svc.estado === "pausado") && (
                            <Button size="sm" variant="outline" className="h-8 gap-1 text-red-400 border-red-400/30" disabled={accionando === svc.id} onClick={() => aplicarEstado(svc, "suspenso")}>
                              <Ban className="w-3.5 h-3.5" /> Suspender
                            </Button>
                          )}
                          {svc.estado === "suspenso" && (
                            <Button size="sm" variant="outline" className="h-8 gap-1 text-emerald-400" disabled={accionando === svc.id} onClick={() => aplicarEstado(svc, "ativo")}>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Restaurar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between text-sm text-muted-foreground">
          <span>{paginacao?.total ?? 0} serviços • Página {pagina} de {paginacao?.paginas ?? 1}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>Anterior</Button>
            <Button variant="outline" size="sm" disabled={pagina >= (paginacao?.paginas ?? 1)} onClick={() => setPagina((p) => p + 1)}>Próxima</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}