"use client"

import AppShell from "@/components/layout/AppShell"
import { useAuthStore } from "@/store/auth.store"

const utilizadorNavItems = [
  { label: "Recomendações", href: "/recomendacoes" },
  { label: "Histórico", href: "/historico" },
  { label: "Perfil", href: "/definicoes" },
]

const provedorNavItems = [
  { label: "Serviços", href: "/servicos" },
  { label: "Estatísticas", href: "/analitica" },
  { label: "Perfil", href: "/definicoes" },
]

const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Utilizadores", href: "/admin/utilizadores" },
  { label: "Serviços", href: "/admin/servicos-global" },
  { label: "Regras de Risco", href: "/admin/regras-risco" },
  { label: "Modelo IA", href: "/admin/modelo" },
  { label: "Auditoria", href: "/admin/auditoria" },
]

export default function ContaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = useAuthStore((s) => s.user)
  const tipo = user?.tipo

  const navItems =
    tipo === "provedor" ? provedorNavItems
      : tipo === "administrador" ? adminNavItems
      : utilizadorNavItems

  return (
    <AppShell navItems={navItems}>
      {children}
    </AppShell>
  )
}