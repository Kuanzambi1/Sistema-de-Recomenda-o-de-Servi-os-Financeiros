interface TableSkeletonProps {
  rows?: number
  columns?: number
}

export default function TableSkeleton({ rows = 5, columns = 5 }: TableSkeletonProps) {
  return (
    <div className="w-full animate-pulse">
      <div className="flex items-center gap-4 px-6 py-4 bg-muted/50 border-b border-border">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-muted-foreground/10"
            style={{ width: `${Math.max(60, 100 / columns)}%` }}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="flex items-center gap-4 px-6 py-4 border-b border-border/50"
        >
          {Array.from({ length: columns }).map((_, col) => (
            <div
              key={col}
              className="h-4 rounded bg-muted-foreground/5"
              style={{ width: `${Math.max(60, 100 / columns)}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#c4c6d04d] animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-muted-foreground/10" />
        <div className="h-5 w-14 rounded-full bg-muted-foreground/10" />
      </div>
      <div className="h-3 w-24 rounded bg-muted-foreground/10 mb-2" />
      <div className="h-8 w-20 rounded bg-muted-foreground/10" />
    </div>
  )
}
