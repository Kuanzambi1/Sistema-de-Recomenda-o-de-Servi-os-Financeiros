import AppShell from "@/components/layout/AppShell"

const utilizadorNavItems = [
  { label: "Recomendações", href: "/recomendacoes" },
  { label: "Histórico", href: "/historico" },
  { label: "Perfil", href: "/definicoes" },
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
