"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Star, Clock, Settings, Briefcase, PlusCircle,
  BarChart3, Users, ShieldAlert, FileSearch, LogOut, ChevronRight,
  Building2, Brain, Bot
} from "lucide-react"

import { useAuthStore } from "@/store/auth.store"
import { useRouter } from "next/navigation"

interface NavItem {
  label: string
  href: string
}

interface SidebarProps {
  brand?: string
  items: NavItem[]
  className?: string
}

// Map labels to icons
const ICON_MAP: Record<string, React.ElementType> = {
  "Recomendações": Star,
  "Histórico": Clock,
  "Definições": Settings,
  "Meus Serviços": Briefcase,
  "Adicionar Serviço": PlusCircle,
  "Analítica e Performance": BarChart3,
  "Dashboard": LayoutDashboard,
  "Gestão de Utilizadores": Users,
  "Gestão de Serviços": Building2,
  "Modelos de Risco": ShieldAlert,
  "Auditoria": FileSearch,
}

export default function Sidebar({ brand = "SRF", items, className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const handleLogout = () => {
    clearAuth()
    router.push("/login")
  }

  const initials = user?.nome?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "U"

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full w-64 flex flex-col bg-[#0A0D14]/70 backdrop-blur-2xl border-r border-white/5 z-40",
        className
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/5 shrink-0 group cursor-pointer hover:bg-white/[0.02] transition-colors">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shrink-0 animate-pulse-glow-sm">
          <span className="text-white font-bold text-sm font-heading tracking-tighter">S</span>
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-heading text-base font-bold text-white tracking-tight">{brand}</span>
          <span className="text-[10px] text-blue-400 font-mono mt-0.5 tracking-wider">v1.0 — Beta</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1.5 px-3 py-6 flex-1 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 px-3 mb-2 font-bold">
          Menu Principal
        </p>
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = ICON_MAP[item.label] ?? ChevronRight
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 relative overflow-hidden",
                isActive
                  ? "text-white bg-blue-500/10 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]"
                  : "text-muted-foreground hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              {/* Active Background Glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none" />
              )}
              
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 relative z-10",
                isActive
                  ? "bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                  : "bg-[#161B22] text-muted-foreground border border-white/5 group-hover:bg-[#1C2128] group-hover:border-white/10 group-hover:text-white"
              )}>
                <Icon className={cn("w-4 h-4", isActive && "animate-in zoom-in-90 duration-300")} />
              </div>
              <span className="truncate relative z-10">{item.label}</span>
              
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] relative z-10" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* AI Status Badge */}
      <div className="px-4 py-3 border-t border-white/5 shrink-0">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 animate-pulse-glow-sm">
            <Brain className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="flex flex-col leading-none flex-1 min-w-0">
            <span className="text-[11px] font-bold text-white">Motor de IA</span>
            <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              Online — Ativo
            </span>
          </div>
        </div>
      </div>

      {/* User footer */}
      <div className="p-4 border-t border-white/5 shrink-0">
        <div onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 cursor-pointer transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shrink-0 border border-white/10 shadow-[0_0_15px_rgba(37,99,235,0.15)] group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-shadow">
            <span className="text-white text-sm font-bold">{initials}</span>
          </div>
          <div className="flex flex-col leading-none flex-1 min-w-0 justify-center">
            <span className="text-sm font-bold text-white truncate mb-1">{user?.nome || "Utilizador"}</span>
            <span className="text-[11px] text-muted-foreground truncate">{user?.email || "utilizador@srf.ao"}</span>
          </div>
          <LogOut className="w-4 h-4 text-muted-foreground/50 group-hover:text-red-400 transition-colors shrink-0" />
        </div>
      </div>
    </aside>
  )
}
