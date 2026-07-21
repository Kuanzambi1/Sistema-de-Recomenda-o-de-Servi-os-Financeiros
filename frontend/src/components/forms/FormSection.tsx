import type { ReactNode } from "react"

interface FormSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export default function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <div className={`flex flex-col gap-5 ${className || ""}`}>
      <h2 className="font-semibold text-foreground border-b border-border pb-2">
        {title}
      </h2>
      <div className={typeof children === "object" && "grid" in (children as any) ? "" : "flex flex-col gap-5"}>
        {children}
      </div>
    </div>
  )
}
