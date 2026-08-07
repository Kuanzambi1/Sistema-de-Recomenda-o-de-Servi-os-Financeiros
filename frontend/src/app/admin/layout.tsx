import AppShell from "@/components/layout/AppShell"

const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Utilizadores", href: "/admin/utilizadores" },
  { label: "Serviços", href: "/admin/servicos-global" },
  { label: "Regras de Risco", href: "/admin/regras-risco" },
  { label: "Modelo IA", href: "/admin/modelo" },
  { label: "Auditoria", href: "/admin/auditoria" },
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
    >
      {children}
    </AppShell>
  )
}
