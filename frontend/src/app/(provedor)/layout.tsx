import AppShell from "@/components/layout/AppShell"

const provedorNavItems = [
  { label: "Serviços", href: "/servicos" },
  { label: "Estatísticas", href: "/analitica" },
  { label: "Perfil", href: "/definicoes" },
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
