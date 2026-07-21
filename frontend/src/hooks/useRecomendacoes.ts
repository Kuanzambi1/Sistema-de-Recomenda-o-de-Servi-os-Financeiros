"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { recomendacoesService } from "@/services/recomendacoes.service"
import { queryKeys } from "@/lib/query-keys"
import type { RecomendacoesQuery, HistoricoQuery } from "@/types"
import { toast } from "sonner"

export function useRecomendacoes(filters?: RecomendacoesQuery) {
  return useQuery({
    queryKey: queryKeys.recomendacoes.all(filters),
    queryFn: () => recomendacoesService.listar(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export function useRecomendacao(id: string) {
  return useQuery({
    queryKey: queryKeys.recomendacoes.detail(id),
    queryFn: () => recomendacoesService.obter(id),
    enabled: !!id,
  })
}

export function useHistorico(filters?: HistoricoQuery) {
  return useQuery({
    queryKey: queryKeys.recomendacoes.historico(filters),
    queryFn: () => recomendacoesService.historico(filters),
    staleTime: 2 * 60 * 1000,
  })
}

export function useVisualizarRecomendacao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => recomendacoesService.visualizar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recomendacoes"] })
    },
  })
}

export function useAceitarRecomendacao() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => recomendacoesService.aceitar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recomendacoes"] })
      toast.success("Interesse registado com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao registar interesse. Tente novamente.")
    },
  })
}
