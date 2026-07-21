"use client"

import { useState } from "react"
import { useCriarFeedback } from "@/hooks/useFeedbacks"
import { Button } from "@/components/ui/button"
import { Star, Loader2, ThumbsUp, ThumbsDown, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackModalProps {
  recomendacaoId: string
  servicoNome: string
  open: boolean
  onClose: () => void
  onSkip?: () => void
}

const LIKERT_LABELS: Record<number, string> = {
  1: "Mau",
  2: "Regular",
  3: "Bom",
  4: "Muito Bom",
  5: "Excelente",
}

export default function FeedbackModal({
  recomendacaoId,
  servicoNome,
  open,
  onClose,
  onSkip,
}: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [util, setUtil] = useState<boolean | null>(null)
  const [comentario, setComentario] = useState("")
  const { mutate: enviar, isPending } = useCriarFeedback()

  if (!open) return null

  const canSubmit = rating > 0 && util !== null

  const handleSubmit = () => {
    if (!canSubmit) return
    enviar(
      {
        recomendacao_id: recomendacaoId,
        nota_likert: rating as 1 | 2 | 3 | 4 | 5,
        util,
        comentario: comentario.trim() || undefined,
      },
      {
        onSuccess: () => {
          setRating(0)
          setUtil(null)
          setComentario("")
          onClose()
        },
      }
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "#00163C66" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="w-full max-w-[520px] bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-heading text-xl font-bold text-primary">
              O que achou desta recomendação?
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">{servicoNome}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-foreground">
              Classificação
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hoverRating || rating)
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                    aria-label={`Classificar ${star} estrelas`}
                  >
                    <Star
                      className={cn(
                        "w-8 h-8 transition-colors",
                        filled
                          ? "text-secondary fill-secondary"
                          : "text-muted-foreground/30"
                      )}
                    />
                  </button>
                )
              })}
              {rating > 0 && (
                <span className="text-sm font-medium text-muted-foreground ml-2">
                  {LIKERT_LABELS[rating]}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-foreground">
              Foi útil para si?
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setUtil(true)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition-all cursor-pointer",
                  util === true
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-border text-muted-foreground hover:border-muted-foreground/40"
                )}
              >
                <ThumbsUp className="w-5 h-5" />
                <span className="font-medium">Sim</span>
              </button>
              <button
                type="button"
                onClick={() => setUtil(false)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 rounded-lg border-2 transition-all cursor-pointer",
                  util === false
                    ? "border-red-400 bg-red-50 text-red-600"
                    : "border-border text-muted-foreground hover:border-muted-foreground/40"
                )}
              >
                <ThumbsDown className="w-5 h-5" />
                <span className="font-medium">Não</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-foreground">
              Comentário <span className="text-muted-foreground font-normal">(opcional)</span>
            </label>
            <textarea
              value={comentario}
              onChange={(e) => {
                if (e.target.value.length <= 500) setComentario(e.target.value)
              }}
              placeholder="Partilhe a sua opinião sobre esta recomendação..."
              className="w-full min-h-[100px] rounded-lg border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              maxLength={500}
            />
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">
                {comentario.length}/500
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-6 py-4 border-t border-border">
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="w-full"
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                A enviar...
              </>
            ) : (
              "Enviar feedback"
            )}
          </Button>
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground py-2 transition-colors cursor-pointer"
            >
              Agora não
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
