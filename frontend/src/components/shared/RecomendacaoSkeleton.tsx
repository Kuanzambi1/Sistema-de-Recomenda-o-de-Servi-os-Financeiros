export function RecomendacaoCardSkeleton() {
  return (
    <div className="p-6 flex flex-col gap-4 w-full border border-border rounded-xl bg-muted animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-5 w-20 rounded-full bg-muted-foreground/10" />
        <div className="h-3 w-24 rounded bg-muted-foreground/10" />
      </div>
      <div className="h-7 w-3/4 rounded bg-muted-foreground/10" />
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <div className="h-3 w-10 rounded bg-muted-foreground/10" />
          <div className="h-3 w-12 rounded bg-muted-foreground/10" />
        </div>
        <div className="h-2 w-full rounded-full bg-muted-foreground/10" />
      </div>
      <div className="grid grid-cols-3 gap-4 py-4 border-y border-border/30">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="h-3 w-16 rounded bg-muted-foreground/10" />
            <div className="h-4 w-20 rounded bg-muted-foreground/10" />
          </div>
        ))}
      </div>
      <div className="h-16 rounded-lg bg-muted-foreground/5" />
      <div className="flex items-center justify-between pt-2">
        <div className="h-4 w-24 rounded bg-muted-foreground/10" />
        <div className="h-10 w-36 rounded-lg bg-muted-foreground/10" />
      </div>
    </div>
  )
}

export function RecomendacaoGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <RecomendacaoCardSkeleton key={i} />
      ))}
    </div>
  )
}
