import AppShell from "@/components/layout/AppShell"

const provedorNavItems = [
  { label: "Serviços", href: "/servicos" },
  { label: "Estatísticas", href: "/servicos/estatisticas" },
  { label: "Clientes", href: "/servicos/clientes" },
  { label: "Perfil", href: "/servicos/perfil" },
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
