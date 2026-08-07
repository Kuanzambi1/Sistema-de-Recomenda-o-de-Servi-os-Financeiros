"use client";

import React, { useState } from "react";
import Text from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, History, Shield, User, FileText } from "lucide-react";

const auditLogs = [
  {
    id: "log-1029",
    timestamp: "2026-07-02 08:32:15",
    actor: "admin@srf.ao",
    action: "ALTERACAO_REGRA_RISCO",
    target: "Regra: Peso de Idade",
    details: "Alterado de 10% para 15%",
    severity: "Alta",
    icon: Shield,
    color: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "log-1028",
    timestamp: "2026-07-02 07:15:00",
    actor: "Sistema",
    action: "BACKUP_DIARIO",
    target: "Base de Dados Primária",
    details: "Backup concluído com sucesso (1.2GB)",
    severity: "Baixa",
    icon: History,
    color: "text-blue-600 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "log-1027",
    timestamp: "2026-07-01 14:22:10",
    actor: "admin_joao@srf.ao",
    action: "SUSPENSAO_SERVICO",
    target: "srv-004 (Cartão de Crédito Standard)",
    details: "Motivo: Violação da política de juros.",
    severity: "Critica",
    icon: Shield,
    color: "text-destructive bg-destructive/10 border-destructive/20",
  },
  {
    id: "log-1026",
    timestamp: "2026-07-01 09:45:33",
    actor: "parcerias@banconacional.ao",
    action: "CRIACAO_SERVICO",
    target: "srv-005 (Empréstimo Pessoal)",
    details: "Serviço submetido para revisão.",
    severity: "Media",
    icon: FileText,
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "log-1025",
    timestamp: "2026-06-30 18:10:05",
    actor: "admin@srf.ao",
    action: "CRIACAO_USUARIO",
    target: "usr-006 (Seguradora Proteção Total)",
    details: "Conta provedor criada com permissões padrão.",
    severity: "Media",
    icon: User,
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  }
];

export default function AuditoriaPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Text as="h1" className="text-3xl font-bold tracking-tight text-foreground">
            Registos de Auditoria
          </Text>
          <Text className="text-muted-foreground mt-1">
            Log imutável de todas as ações administrativas, alterações de sistema e segurança.
          </Text>
        </div>
        <Button variant="outline" className="gap-2 font-semibold shadow-sm bg-card border-border/50">
          <Download className="w-4 h-4" />
          Exportar Relatório (CSV)
        </Button>
      </div>

      <Card className="bg-card/40 backdrop-blur-sm border-border/50 overflow-hidden shadow-sm">
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-border/50 bg-muted/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar por ID, Ator ou Ação..." 
              className="pl-9 bg-background border-border/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto gap-2 bg-background border-border/50">
            <Filter className="w-4 h-4" />
            Filtrar por Severidade
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Timestamp / ID</th>
                <th className="px-6 py-4 font-medium">Ator</th>
                <th className="px-6 py-4 font-medium">Ação (Evento)</th>
                <th className="px-6 py-4 font-medium">Alvo & Detalhes</th>
                <th className="px-6 py-4 font-medium text-right">Severidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {auditLogs.map((log) => {
                const Icon = log.icon;
                return (
                  <tr key={log.id} className="hover:bg-accent/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground whitespace-nowrap">{log.timestamp}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 font-mono">{log.id}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {log.actor}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-xs font-semibold bg-muted px-2 py-1 rounded">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{log.target}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{log.details}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant="outline" className={`font-medium border ${log.color} uppercase text-[10px]`}>
                        {log.severity}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between text-sm text-muted-foreground">
          <span>Mostrando 5 de 84.102 eventos</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm">Próxima</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
