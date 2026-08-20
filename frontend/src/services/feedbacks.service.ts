import api from "@/lib/axios";
import { Feedback, FeedbackPayload } from "@/types";

export const feedbacksService = {
  submeter: async (payload: FeedbackPayload): Promise<Feedback> => {
    const { data } = await api.post<any>("/feedbacks", payload);
    return data.feedback;
  },

  listarMeus: async (): Promise<Feedback[]> => {
    const { data } = await api.get<any>("/feedbacks/meus");
    return data.feedbacks;
  },
};
