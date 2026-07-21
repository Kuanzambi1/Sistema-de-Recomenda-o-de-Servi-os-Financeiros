"use client"

import { useMutation } from "@tanstack/react-query"
import { feedbacksService } from "@/services/feedbacks.service"
import type { FeedbackPayload } from "@/types"
import { toast } from "sonner"

export function useCriarFeedback() {
  return useMutation({
    mutationFn: (payload: FeedbackPayload) => feedbacksService.criar(payload),
    onSuccess: () => {
      toast.success("Feedback enviado. Obrigado!")
    },
    onError: () => {
      toast.error("Erro ao enviar feedback. Tente novamente.")
    },
  })
}
