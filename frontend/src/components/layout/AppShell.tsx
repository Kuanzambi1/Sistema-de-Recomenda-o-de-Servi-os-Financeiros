"use client"

import { useState } from "react"
import Sidebar from "./Sidebar"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"

interface NavItem {
  label: string
  href: string
}

interface AppShellProps {
  children: React.ReactNode
  navItems: NavItem[]
  title?: string
  subtitle?: string
  className?: string
  variant?: "light" | "dark"
  hideHeader?: boolean
}

export default function AppShell({ children, navItems, className, variant = "light", hideHeader }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        items={navItems}
        variant={variant}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 lg:ml-64">
        {hideHeader && (
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden fixed left-4 top-4 z-30 w-10 h-10 rounded-lg flex items-center justify-center text-[#44474f] hover:text-[#151c27] hover:bg-muted bg-white/90 backdrop-blur-sm border border-[#c4c6d0] shadow-sm transition-colors"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {!hideHeader && (
          <header
            className={cn(
              "flex items-center h-16 px-4 lg:px-8 border-b border-border",
              variant === "dark"
                ? "bg-[#f0f3ff]"
                : "bg-sidebar/90 backdrop-blur-md"
            )}
          >
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-[#44474f] hover:text-[#151c27] hover:bg-muted transition-colors mr-3"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center justify-end flex-1 gap-4">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-[#44474f]" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12.5 14.5v-1.5A3 3 0 0 0 9.5 10h-3a3 3 0 0 0-3 3v1.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
              <div className="h-8 w-px bg-[#c4c6d0] hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-right">
                  <p className="text-sm font-bold text-[#00163c] leading-tight">Dr. Manuel Neto</p>
                  <p className="text-[10px] text-[#44474f] tracking-[0.5px] uppercase">Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-[#00163c]/10 shrink-0" style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=Manuel+Neto&background=0F2B5B&color=fff&size=80')" }} />
              </div>
            </div>
          </header>
        )}
        <main className={cn("flex-1", className)}>
          {children}
        </main>
        {variant === "dark" && (
          <footer className="h-12 flex items-center justify-center bg-white border-t border-[#c4c6d0] px-4">
            <p className="text-[#44474f] text-xs text-center">
              2026 SRF - Sistema de Recomendação Financeira. Todos os direitos reservados.
            </p>
          </footer>
        )}
      </div>
    </div>
  )
}
