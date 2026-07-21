import { forwardRef } from "react"
import type { SelectHTMLAttributes } from "react"
import FormField from "./FormField"

interface Option {
  value: string
  label: string
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Option[]
  error?: string
  containerClassName?: string
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, containerClassName, className, required, ...props }, ref) => {
    return (
      <FormField label={label} required={required} error={error} className={containerClassName}>
        <select
          ref={ref}
          className={`h-10 rounded-lg border border-border bg-muted/30 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 ${className || ""}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FormField>
    )
  }
)
FormSelect.displayName = "FormSelect"

export default FormSelect
