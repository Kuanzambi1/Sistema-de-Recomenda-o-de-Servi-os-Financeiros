import AppShell from "@/components/layout/AppShell"

const adminNavItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Utilizadores", href: "/admin/utilizadores" },
  { label: "Provedores", href: "/admin/provedores" },
  { label: "Serviços", href: "/admin/servicos" },
  { label: "Relatórios", href: "/admin/relatorios" },
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
