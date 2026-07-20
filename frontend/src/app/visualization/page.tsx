"use client";

import { Bell, LayoutDashboard, Users, Shield, FileText, HelpCircle, LogOut, ChevronRight } from "lucide-react";

export default function VisualizationPage() {
  return (
    <div className="min-h-screen bg-[#f9f9ff]">
      {/* TopBar */}
      <header className="flex items-center justify-between h-16 px-6 bg-[#f0f3ff] shadow-sm">
        <h1 className="font-heading text-xl font-bold text-[#00163c]">Admin Panel</h1>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-[#44474f]" />
          <div className="w-px h-6 bg-[#c4c6d0]" />
          <div className="w-9 h-9 rounded-full bg-[#00163c] flex items-center justify-center">
            <span className="text-white text-sm font-bold">A</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] bg-[#00163c] flex flex-col justify-between p-4">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-4 px-4 py-6">
              <div className="w-10 h-10 rounded-xl bg-[#feae2c] flex items-center justify-center">
                <span className="text-[#6b4500] font-heading text-lg font-bold">A</span>
              </div>
              <div>
                <h2 className="text-white font-heading text-xl font-semibold">SRF</h2>
                <p className="text-white/70 text-xs tracking-wide">Institutional Access</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="mt-6 flex flex-col gap-2">
              <NavItem icon={LayoutDashboard} label="Dashboard" active={false} />
              <NavItem icon={Users} label="User Management" active={true} />
              <NavItem icon={Shield} label="Governance" active={false} />
              <NavItem icon={FileText} label="Audit Logs" active={false} />
              <NavItem icon={FileText} label="Risk Models" active={false} />
            </nav>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
            <NavItem icon={HelpCircle} label="Help Center" active={false} />
            <NavItem icon={LogOut} label="Logout" active={false} />
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl font-bold text-[#00163c]">Visualização dos Componentes Admin</h2>
              <p className="text-[#44474f] text-sm mt-1">Componentes: SideNavBar, TopBar e Footer do perfil Admin</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <ComponentCard title="SideNavBar" description="Sidebar de navegação com fundo escuro (#00163c), logo, 5 links de navegação + secção de perfil inferior">
              <div className="bg-[#00163c] rounded-xl p-4 text-white text-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#feae2c]" />
                  <div>
                    <p className="font-bold text-sm">SRF</p>
                    <p className="text-white/60 text-[10px]">Institutional Access</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-3 space-y-2">
                  {["Dashboard", "User Management", "Governance", "Audit Logs", "Risk Models"].map((item, i) => (
                    <div key={item} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${i === 1 ? "bg-[#feae2c]" : ""}`}>
                      <div className="w-4 h-4 rounded bg-white/20" />
                      <span className={`text-xs ${i === 1 ? "text-[#835500] font-bold" : "text-white/70"}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ComponentCard>

            <ComponentCard title="TopBar" description="Barra superior com fundo #f0f3ff, título, sino de notificações, divisor vertical e avatar">
              <div className="bg-[#f0f3ff] rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="h-4 w-32 rounded bg-[#00163c]/20" />
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-[#44474f]" />
                  <div className="w-px h-5 bg-[#c4c6d0]" />
                  <div className="w-7 h-7 rounded-full bg-[#00163c]" />
                </div>
              </div>
            </ComponentCard>

            <ComponentCard title="Footer" description="Rodapé standard do Admin com copyright e links de navegação">
              <div className="bg-white rounded-xl p-4 border border-[#c4c6d0]/30 flex items-center justify-between text-xs">
                <span className="text-[#44474f]">© 2026 SRF</span>
                <div className="flex gap-4 text-[#44474f]">
                  <span>Privacidade</span>
                  <span>Termos</span>
                  <span>Ajuda</span>
                  <span>Contacto</span>
                </div>
              </div>
            </ComponentCard>
          </div>

          {/* Estrutura completa */}
          <div className="mt-10">
            <h3 className="font-heading text-lg font-bold text-[#00163c] mb-4">Estrutura da Página Admin</h3>
            <div className="bg-white rounded-xl border border-[#c4c6d0]/50 p-6 shadow-sm">
              <pre className="text-sm text-[#44474f] font-mono whitespace-pre-wrap">
{`┌─────────────────────────────────────────────────┐
│  TopBar (Header - TopNavBar)                    │
│  bg: #f0f3ff | h-16 | sino + avatar             │
├──────────┬──────────────────────────────────────┤
│          │                                       │
│ SideBar  │   Content Area                        │
│ bg:      │                                       │
│ #00163c  │                                       │
│ w-64     │                                       │
│          │                                       │
│          │                                       │
│          │                                       │
│ Logo     │                                       │
│ Nav x5   │                                       │
│ ───────  │                                       │
│ Help     │                                       │
│ Logout   │                                       │
├──────────┴──────────────────────────────────────┤
│  Footer (Component / Admin / Footer)            │
│  bg: white | copyright + links                  │
└─────────────────────────────────────────────────┘`}
              </pre>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between h-16 px-6 bg-white border-t border-[#c4c6d0]/30">
        <p className="text-sm text-[#44474f]">2026 SRF - Sistema de Recomendação Financeira. Todos os direitos reservados.</p>
        <div className="flex gap-6 text-sm text-[#44474f]">
          <a href="#" className="hover:text-[#00163c]">Privacidade</a>
          <a href="#" className="hover:text-[#00163c]">Termos</a>
          <a href="#" className="hover:text-[#00163c]">Ajuda</a>
          <a href="#" className="hover:text-[#00163c]">Contacto</a>
        </div>
      </footer>
    </div>
  );
}

function NavItem({ icon: Icon, label, active }: { icon: any; label: string; active: boolean }) {
  return (
    <a
      href="#"
      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
        active
          ? "bg-[#feae2c] text-[#835500] font-bold"
          : "text-white/70 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-[18px] h-[18px]" />
      <span className="text-sm tracking-wide">{label}</span>
    </a>
  );
}

function ComponentCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#c4c6d0]/50 p-5 shadow-sm">
      <h3 className="font-heading text-base font-bold text-[#00163c] mb-1">{title}</h3>
      <p className="text-xs text-[#44474f] mb-4">{description}</p>
      {children}
    </div>
  );
}
