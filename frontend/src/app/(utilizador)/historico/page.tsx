"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Clock, XCircle, ChevronRight, Loader2 } from "lucide-react";
import { recomendacoesService } from "@/services/recomendacoes.service";

const statusMap: Record<string, { icon: React.ElementType; label: string; color: string; bg: string; dot: string }> = {
  accepted: { icon: CheckCircle2, label: "Aceite", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", dot: "bg-emerald-400" },
  rejected: { icon: XCircle, label: "Rejeitado", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", dot: "bg-red-400/50" },
  pending:  { icon: Clock, label: "Pendente", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20", dot: "bg-amber-400" },
};

function getStatus(rec: any) {
  if (rec.aceite === true) return "accepted";
  if (rec.aceite === false) return "rejected";
  return "pending";
}

export default function HistoricoPage() {
  const [recs, setRecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    (async () => {
      try {
        const result = await recomendacoesService.listar();
        setRecs(result.data);
      } catch {
        // silently fallback to empty
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = recs.filter((r) => {
    if (filter === "Todos") return true;
    const s = getStatus(r);
    if (filter === "Aceite") return s === "accepted";
    if (filter === "Rejeitado") return s === "rejected";
    if (filter === "Pendente") return s === "pending";
    return true;
  });

  return (
    <div className="flex flex-col gap-8 p-6 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">Histórico de Recomendações</h1>
        <p className="text-muted-foreground mt-1 text-sm">Acompanhe o estado dos serviços financeiros recomendados.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["Todos", "Aceite", "Pendente", "Rejeitado"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === f
                ? "bg-primary/15 border-primary/30 text-primary"
                : "bg-white/5 border-border text-muted-foreground hover:bg-white/10 hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Clock className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-1">Sem registos</h2>
          <p className="text-muted-foreground text-sm">Nenhuma recomendação encontrada com este filtro.</p>
        </div>
      )}

      {/* Timeline */}
      {!loading && filtered.length > 0 && (
        <div className="relative flex flex-col">
          <div className="absolute left-[22px] top-6 bottom-6 w-px bg-border" />
          <div className="flex flex-col gap-6">
            {filtered.map((rec) => {
              const s = getStatus(rec);
              const st = statusMap[s];
              const StatusIcon = st.icon;

              return (
                <div key={rec.id} className="group flex items-start gap-5 relative">
                  <div className={`relative z-10 w-11 h-11 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${st.bg} border-current ${st.color}`}>
                    <StatusIcon className="w-4.5 h-4.5" />
                    {s === "pending" && (
                      <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 flex items-center justify-between p-5 rounded-xl bg-card border border-border hover:border-white/15 hover:bg-card/80 transition-all cursor-pointer group-hover:shadow-lg group-hover:shadow-black/20">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                        {rec.nome_provedor}
                      </p>
                      <h3 className="text-base font-bold text-foreground mb-2">{rec.nome_servico}</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(rec.criado_em).toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {Math.round((rec.probabilidade_adequacao ?? 0) * 100)}% match
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.color}`}>
                        {st.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
