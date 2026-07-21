"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { servicosService } from "@/services/servicos.service"
import { queryKeys } from "@/lib/query-keys"
import type { ServicosQuery, ServicoFinanceiroPayload } from "@/types"
import { toast } from "sonner"

export function useServicos(filters?: ServicosQuery) {
  return useQuery({
    queryKey: queryKeys.servicos.all(filters),
    queryFn: () => servicosService.listar(filters),
  })
}

export function useServico(id: string) {
  return useQuery({
    queryKey: queryKeys.servicos.detail(id),
    queryFn: () => servicosService.obter(id),
    enabled: !!id,
  })
}

export function useCreateServico() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ServicoFinanceiroPayload) => servicosService.criar(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicos"] })
      toast.success("Serviço guardado com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao guardar serviço. Tente novamente.")
    },
  })
}

export function useToggleServico() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => servicosService.toggleAtivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicos"] })
    },
  })
}

export function useDeleteServico() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => servicosService.remover(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["servicos"] })
      toast.success("Serviço removido com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao remover serviço.")
    },
  })
}
