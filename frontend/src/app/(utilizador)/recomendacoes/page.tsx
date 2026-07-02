"use client";

import { useState, useMemo } from "react";
import { Recomendacao } from "@/types";
import { mockRecomendacoes } from "@/lib/mock-data";
import RecommendationCard from "@/components/recomendacoes/RecommendationCard";
import DetalhesRecomendacao from "@/components/recomendacoes/DetalhesRecomendacao";
import Footer from "@/components/layout/Footer";
import { Search, Bell, Settings, ChevronLeft, ChevronRight } from "lucide-react";

type FiltroTipo = "todos" | "credito" | "seguro";

const ITEMS_PER_PAGE = 4;

export default function RecomendacoesPage() {
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);

  const recomendacoes = useMemo<Recomendacao[]>(() => {
    if (filtroTipo === "todos") return mockRecomendacoes;
    return mockRecomendacoes.filter((r) => r.servico.tipo === filtroTipo);
  }, [filtroTipo]);

  const totalPages = Math.max(1, Math.ceil(recomendacoes.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const pageItems = useMemo<Recomendacao[]>(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return recomendacoes.slice(start, start + ITEMS_PER_PAGE);
  }, [recomendacoes, safePage]);

  const best = pageItems.find((r) => r.posicao_ranking === 1);
  const rest = pageItems.filter((r) => r.posicao_ranking !== 1);

  return (
    <div className="flex flex-col min-h-full bg-background">
      <header className="flex items-center justify-between h-16 px-8 bg-background border-b border-border">
        <div />
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar"
              className="h-10 pl-10 pr-4 rounded-full bg-muted text-sm text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-1 focus:ring-ring w-64"
            />
          </div>
          <button type="button" className="text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </button>
          <button type="button" className="text-muted-foreground hover:text-foreground">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 p-8">
        <div className="max-w-[976px] mx-auto w-full flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-[32px] font-bold text-primary">
              As suas recomendações
            </h1>
            <p className="text-muted-foreground text-base">
              Baseadas no seu perfil financeiro, ordenadas por adequação.
            </p>
          </div>

          <div className="flex items-center justify-between bg-muted rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2">
              {(["todos", "credito", "seguro"] as const).map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setFiltroTipo(tipo)}
                  className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filtroTipo === tipo
                      ? "bg-foreground text-primary-foreground"
                      : "bg-background text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {tipo === "todos" ? "Todos" : tipo === "credito" ? "Crédito" : "Seguros"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-primary">
                {recomendacoes.length} recomendações encontradas
              </span>
              <span className="text-xs text-muted-foreground">
                Ordenado por: <span className="text-foreground font-medium">Mais adequado</span>
              </span>
            </div>
          </div>

          {recomendacoes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <p className="text-lg font-medium">Nenhuma recomendação encontrada</p>
              <p className="text-sm">Complete o seu perfil financeiro para receber recomendações personalizadas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {best && (
                <div className="lg:col-span-2">
                  <RecommendationCard
                    recomendacao={best}
                    isBest
                    onVerDetalhes={setSelectedRecId}
                  />
                </div>
              )}
              {rest.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  recomendacao={rec}
                  onVerDetalhes={setSelectedRecId}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 pt-4" aria-label="Paginação">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                    page === safePage
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Próximo
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>
          )}
        </div>
      </div>

      <Footer />

      {selectedRecId && (() => {
        const rec = mockRecomendacoes.find((r) => r.id === selectedRecId);
        if (!rec) return null;
        return (
          <DetalhesRecomendacao
            recomendacao={rec}
            open
            onClose={() => setSelectedRecId(null)}
          />
        );
      })()}
    </div>
  );
}
