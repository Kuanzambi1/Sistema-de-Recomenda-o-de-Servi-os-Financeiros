"use client";

import React, { useState } from "react";
import Text from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, CheckCircle2, ShieldAlert, FileSearch, Play, Pause } from "lucide-react";

const allServicesData = [
  {
    id: "srv-001",
    name: "Conta Poupança Premium",
    provider: "Banco Nacional",
    category: "Investimento",
    status: "Ativo",
    score: "98%",
    statusColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "srv-002",
    name: "Crédito Pessoal Flex",
    provider: "Banco Nacional",
    category: "Crédito",
    status: "Em Revisão",
    score: "-",
    statusColor: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "srv-003",
    name: "Seguro Auto Familiar",
    provider: "Seguradora Proteção Total",
    category: "Seguro",
    status: "Pausado",
    score: "85%",
    statusColor: "text-muted-foreground bg-muted border-border",
  },
  {
    id: "srv-004",
    name: "Cartão de Crédito Standard",
    provider: "Fintech Rápido",
    category: "Crédito",
    status: "Suspenso",
    score: "40%",
    statusColor: "text-destructive bg-destructive/10 border-destructive/20",
  }
];

export default function GestaoGlobalServicosPage() {
  const [searchTerm, setSearchTerm] = useState("");

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
        <div className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-border/50 bg-muted/20">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome, provedor ou ID..." 
              className="pl-9 bg-background border-border/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto gap-2 bg-background border-border/50">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Verificar Pendentes
            </Button>
            <Button variant="outline" className="w-full sm:w-auto gap-2 bg-background border-border/50">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Serviço / ID</th>
                <th className="px-6 py-4 font-medium">Provedor</th>
                <th className="px-6 py-4 font-medium">Categoria</th>
                <th className="px-6 py-4 font-medium">Status Global</th>
                <th className="px-6 py-4 font-medium">Audit Score</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {allServicesData.map((service) => (
                <tr key={service.id} className="hover:bg-accent/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-foreground">{service.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-mono">{service.id}</div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">
                    {service.provider}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {service.category}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={`font-medium border ${service.statusColor}`}>
                      {service.status === 'Ativo' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {service.status === 'Em Revisão' && <FileSearch className="w-3 h-3 mr-1" />}
                      {service.status === 'Pausado' && <Pause className="w-3 h-3 mr-1" />}
                      {service.status === 'Suspenso' && <ShieldAlert className="w-3 h-3 mr-1" />}
                      {service.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${service.score === '-' ? 'text-muted-foreground' : parseInt(service.score) > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {service.score}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {service.status === 'Em Revisão' && (
                        <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white">Aprovar</Button>
                      )}
                      {service.status === 'Ativo' && (
                        <Button size="icon" variant="outline" className="h-8 w-8 text-destructive border-destructive/30 hover:bg-destructive/10">
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground">
                        Auditar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between text-sm text-muted-foreground">
          <span>Mostrando 4 de 1.205 serviços</span>
        </div>
      </Card>
    </div>
  );
}
