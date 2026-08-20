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
    <div className={cn("flex items-center justify-center gap-0", className)}>
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-0">
          <div className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                step.number <= currentStep
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "bg-muted text-muted-foreground border border-border"
              )}
            >
              {step.number}
            </div>
            <span
              className={cn(
                "text-xs font-medium text-center transition-colors",
                step.number <= currentStep
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
              style={{ fontFamily: "DM Sans", fontSize: 14, fontWeight: 500, lineHeight: "16px" }}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-16 h-px mx-2 mb-5 transition-colors",
                step.number < currentStep ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
