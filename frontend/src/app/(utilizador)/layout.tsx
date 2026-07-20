"use client"

import { Sparkles, Clock, User, Bell, Settings, Building2, List } from "lucide-react"
import AppShell from "@/components/layout/AppShell"
import type { NavItem } from "@/components/layout/Sidebar"

const utilizadorNavItems: NavItem[] = [
  { label: "Recomendações", href: "/recomendacoes", icon: Sparkles },
  { label: "Todas as Recomendações", href: "/recomendacoes/listar", icon: List },
  { label: "Histórico", href: "/historico", icon: Clock },
  { label: "Provedores", href: "/provedores", icon: Building2 },
  { label: "Notificações", href: "/notificacoes", icon: Bell },
  { label: "O Meu Perfil", href: "/perfil", icon: User },
  { label: "Definições", href: "/configuracoes", icon: Settings },
]

export default function UtilizadorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell
      navItems={utilizadorNavItems}
    >
      {children}
    </AppShell>
  )
}
