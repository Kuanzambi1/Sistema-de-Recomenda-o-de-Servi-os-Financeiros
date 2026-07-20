"use client"

import { LayoutDashboard, Users, Building2, Briefcase, MessageSquare, Settings } from "lucide-react"
import AppShell from "@/components/layout/AppShell"
import type { NavItem } from "@/components/layout/Sidebar"

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Utilizadores", href: "/admin/utilizadores", icon: Users },
  { label: "Provedores", href: "/admin/provedores", icon: Building2 },
  { label: "Serviços", href: "/admin/servicos", icon: Briefcase },
  { label: "Feedbacks", href: "/admin/feedbacks", icon: MessageSquare },
  { label: "Definições", href: "/admin/definicoes", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell
      navItems={adminNavItems}
      title="Administração"
      variant="dark"
    >
      {children}
    </AppShell>
  )
}
