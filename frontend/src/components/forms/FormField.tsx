import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
  className?: string
}

export default function FormField({ label, required, error, children, className }: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className || ""}`}>
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
