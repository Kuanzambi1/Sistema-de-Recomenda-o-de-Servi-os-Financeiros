"use client"

import { Bell } from "lucide-react"
import Sidebar from "./Sidebar"
import { cn } from "@/lib/utils"
import { Bell, Search, Brain } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"

interface NavItem {
  label: string
  href: string
}

interface AppShellProps {
  children: React.ReactNode
  navItems: NavItem[]
  title?: string
  subtitle?: string
  variant?: "light" | "dark"
  className?: string
}

<<<<<<< HEAD
export default function AppShell({ children, navItems, title, subtitle, className }: AppShellProps) {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const initials = user?.nome?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"

  const activeItem = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  )
  const pageTitle = title ?? activeItem?.label ?? "SRF"

  return (
    <div className="flex min-h-screen bg-[#0A0D14] selection:bg-primary/30 relative overflow-hidden">
      {/* AI Circuit Grid Background */}
      <div className="fixed inset-0 ai-grid-bg opacity-30 pointer-events-none z-0" />
      <div className="fixed top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none z-0" />

      <Sidebar items={navItems} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 ml-64 min-h-screen relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-[#0A0D14]/70 backdrop-blur-2xl border-b border-white/5">
          {/* Left: Breadcrumb + AI Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm font-medium">SRF</span>
              <span className="text-muted-foreground/40 text-sm">/</span>
              <span className="text-sm font-bold text-white">{pageTitle}</span>
            </div>
            {/* AI Active badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Brain className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">IA Ativa</span>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-4">
            {/* Search button */}
            <button className="group flex items-center gap-3 px-3 h-9 rounded-xl bg-white/5 border border-white/5 text-muted-foreground text-xs hover:bg-white/10 hover:border-white/10 hover:text-white transition-all shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Search className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" />
              <span className="hidden md:inline font-medium">Pesquisar...</span>
              <kbd className="hidden md:inline text-[10px] font-mono bg-black/40 text-muted-foreground px-1.5 py-0.5 rounded-md border border-white/10">⌘K</kbd>
            </button>

            {/* Notifications */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-muted-foreground hover:text-white hover:bg-white/10 hover:border-white/10 transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
            </button>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all hover:scale-105 border border-white/10">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
=======
export default function AppShell({ children, navItems, title, subtitle, variant = "light", className }: AppShellProps) {
  return (
    <div className={cn("flex min-h-screen", variant === "dark" ? "bg-[#f9f9ff]" : "bg-background")}>
      <Sidebar items={navItems} variant={variant} />
      <div className="flex flex-col flex-1 ml-64">
        <header
          className={cn(
            "flex items-center justify-between h-16 px-8 border-b transition-colors",
            variant === "dark"
              ? "bg-[#f0f3ff] border-[#c4c6d0] shadow-sm"
              : "bg-sidebar/90 backdrop-blur-md border-border"
          )}
        >
          <div>
            {title && (
              <h1 className={cn(
                "font-heading text-lg font-semibold",
                variant === "dark" ? "text-[#00163c]" : "text-foreground"
              )}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
>>>>>>> 8d6439d (refactor: rename (admin) to admin, add notificacoes/provedores/recomendacoes pages, remove localStorage)
          </div>
          {variant === "dark" && (
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-[#44474f]" />
              <div className="w-px h-6 bg-[#c4c6d0]" />
              <div className="w-9 h-9 rounded-full bg-[#00163c] flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className={cn("flex-1 p-6 max-w-7xl mx-auto w-full", className)}>
          {children}
        </main>
        {variant === "dark" && (
          <footer className="flex items-center justify-center h-12 bg-white border-t border-[#c4c6d0]">
            <p className="text-[#44474f] text-xs">
              2026 SRF - Sistema de Recomendação Financeira. Todos os direitos reservados.
            </p>
          </footer>
        )}
      </div>
    </div>
  )
}
