import AppShell from "@/components/layout/AppShell"

const utilizadorNavItems = [
  { label: "Recomendações", href: "/recomendacoes" },
  { label: "Histórico", href: "/historico" },
  { label: "Perfil", href: "/perfil" },
  { label: "Onboarding", href: "/onboarding" },
]

export default function UtilizadorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell
      navItems={utilizadorNavItems}
      title="Recomendações"
      subtitle="Olá, Utilizador"
    >
      {children}
    </AppShell>
  )
}
