"use client";

import React, { useEffect, useState } from "react";
import Text from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Shield, History, FileText, AlertTriangle } from "lucide-react";
import { adminService } from "@/services/admin.service";

const ICONOS: Record<string, any> = {
  CRIACAO_UTILIZADOR: Shield,
  CRIACAO_SERVICO: FileText,
  ATUALIZACAO_SERVICO: FileText,
  RECOMENDACAO_GERADA: History,
  FEEDBACK_SUBMETIDO: Shield,
  RETREINO_MODELO: AlertTriangle,
};

const SEVERIDADE: Record<string, string> = {
  baixa: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  media: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  alta: "text-destructive bg-destructive/10 border-destructive/20",
};

interface Evento {
  id: number;
  timestamp: string;
  ator: string;
  acao: string;
  alvo: string;
  detalhes: string;
  severidade: string;
}

export default function AuditoriaPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await adminService.listarAuditoria();
        setEventos(data.eventos ?? []);
      } catch (err: any) {
        setError(err?.message ?? "Erro ao carregar os registos de auditoria.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = eventos.filter(e =>
    [e.ator, e.acao, e.alvo, e.detalhes].some(v => v?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Text as="h1" className="text-3xl font-bold tracking-tight text-foreground">
          Registos de Auditoria
        </Text>
        <Text className="text-muted-foreground mt-1">
          Atividade recente do sistema, derivada diretamente da base de dados (utilizadores, serviços, recomendações, feedbacks e re-treinos do modelo).
        </Text>
      </div>

      <Card className="bg-card/40 backdrop-blur-sm border-border/50 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border/50 bg-muted/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por ator, evento ou detalhe..."
              className="pl-9 bg-background border-border/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  <th className="px-6 py-4 font-medium">Timestamp / ID</th>
                  <th className="px-6 py-4 font-medium">Ator</th>
                  <th className="px-6 py-4 font-medium">Evento</th>
                  <th className="px-6 py-4 font-medium">Alvo &amp; Detalhes</th>
                  <th className="px-6 py-4 font-medium text-right">Severidade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      Nenhum evento registado.
                    </td>
                  </tr>
                )}
                {filtered.map((log) => {
                  const Icon = ICONOS[log.acao] ?? Shield;
                  return (
                    <tr key={log.id} className="hover:bg-accent/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString("pt-PT")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 font-mono">evt-{log.id}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{log.ator}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-xs font-semibold bg-muted px-2 py-1 rounded">
                            {log.acao.replace(/_/g, " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{log.alvo}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{log.detalhes}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant="outline" className={`font-medium border uppercase text-[10px] ${SEVERIDADE[log.severidade] ?? SEVERIDADE.baixa}`}>
                          {log.severidade}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between text-sm text-muted-foreground">
          <span>{filtered.length} evento(s)</span>
        </div>
      </Card>
    </div>
  );
}