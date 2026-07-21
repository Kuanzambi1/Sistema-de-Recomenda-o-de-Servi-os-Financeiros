"use client"

import AppShell from "@/components/layout/AppShell"
import type { NavItem } from "@/components/layout/Sidebar"

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Utilizadores", href: "/admin/utilizadores" },
  { label: "Provedores", href: "/admin/provedores" },
  { label: "Serviços", href: "/admin/servicos" },
  { label: "Feedbacks", href: "/admin/feedbacks" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell navItems={adminNavItems} variant="dark">
      {children}
    </AppShell>
  )
}
