import { cn } from "@/lib/utils"

interface Step {
  number: number
  label: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              step.number === currentStep
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground bg-transparent"
            )}
          >
            <span className="font-semibold">{step.number}</span>
            <span>{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <span className="text-lg text-border">→</span>
          )}
        </div>
      ))}
    </div>
  )
}
