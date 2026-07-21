import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[32px] font-normal text-[#00163c] -tracking-[0.32px]">
          {title}
        </h1>
        {description && (
          <p className="text-[#44474f] text-base">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-4 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
