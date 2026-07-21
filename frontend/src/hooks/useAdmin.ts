"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminService } from "@/services/admin.service"
import { queryKeys } from "@/lib/query-keys"
import type { UtilizadoresQuery, FeedbacksQuery } from "@/types"
import { toast } from "sonner"

export function useAdminDashboard() {
  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: () => adminService.dashboard(),
    refetchInterval: 60 * 1000,
  })
}

export function useAdminUtilizadores(filters?: UtilizadoresQuery) {
  return useQuery({
    queryKey: queryKeys.admin.utilizadores(filters),
    queryFn: () => adminService.listarUtilizadores(filters),
  })
}

export function useToggleUtilizador() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminService.toggleUtilizador(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "utilizadores"] })
    },
  })
}

export function useAdminProvedores(filters?: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.admin.provedores(filters),
    queryFn: () => adminService.listarProvedores(filters),
  })
}

export function useCriarProvedor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { nome_empresa: string; email: string; password: string }) =>
      adminService.criarProvedor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "provedores"] })
      toast.success("Provedor criado com sucesso!")
    },
    onError: () => {
      toast.error("Erro ao criar provedor.")
    },
  })
}

export function useAdminServicos(filters?: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.admin.servicos(filters),
    queryFn: () => adminService.listarServicos(filters),
  })
}

export function useAdminFeedbacks(filters?: FeedbacksQuery) {
  return useQuery({
    queryKey: queryKeys.admin.feedbacks(filters),
    queryFn: () => adminService.listarFeedbacks(filters),
  })
}
