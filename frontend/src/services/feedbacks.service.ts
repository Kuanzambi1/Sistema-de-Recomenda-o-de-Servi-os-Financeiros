import api from "@/lib/axios"
import type { Feedback, FeedbackPayload } from "@/types"

export const feedbacksService = {
  criar: async (payload: FeedbackPayload): Promise<Feedback> => {
    const { data } = await api.post<Feedback>("/feedbacks", payload)
    return data
  },
}
