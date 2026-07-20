"use client"

import { Briefcase, BarChart3, Users, User } from "lucide-react"
import AppShell from "@/components/layout/AppShell"
import type { NavItem } from "@/components/layout/Sidebar"

const provedorNavItems: NavItem[] = [
  { label: "Serviços", href: "/servicos", icon: Briefcase },
  { label: "Estatísticas", href: "/servicos/estatisticas", icon: BarChart3 },
  { label: "Clientes", href: "/servicos/clientes", icon: Users },
  { label: "Perfil", href: "/servicos/perfil", icon: User },
]

export default function ProvedorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell
      navItems={provedorNavItems}
      title="Meus Serviços"
    >
      {children}
    </AppShell>
  )
}
