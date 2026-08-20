"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  if (theme === undefined) {
    return (
      <div
        className={cn(
          "w-9 h-9 rounded-xl bg-muted/50 border border-border flex items-center justify-center",
          className
        )}
        aria-hidden
      />
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      type="button"
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      title={isDark ? "Modo claro" : "Modo escuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative w-9 h-9 flex items-center justify-center rounded-xl bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border transition-all hover:shadow-sm cursor-pointer overflow-hidden",
        className
      )}
    >
      <Sun
        className={cn(
          "w-4.5 h-4.5 absolute transition-all duration-300",
          isDark ? "opacity-0 scale-50 rotate-90" : "opacity-100 scale-100 rotate-0"
        )}
      />
      <Moon
        className={cn(
          "w-4.5 h-4.5 absolute transition-all duration-300",
          isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"
        )}
      />
    </button>
  )
}