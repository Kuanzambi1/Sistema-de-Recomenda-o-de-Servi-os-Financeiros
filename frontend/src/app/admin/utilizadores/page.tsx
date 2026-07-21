"use client"

import { useState } from "react"
import AdminTable from "@/components/shared/AdminTable"
import type { AdminColumn } from "@/components/shared/AdminTable"
import PageHeader from "@/components/shared/PageHeader"
import Link from "next/link"
import {
  Users,
  UserPlus,
  Activity,
  Eye,
  MoreHorizontal,
} from "lucide-react"

const statCards = [
  { label: "Total Users", value: "12,482", change: "+8.4%", changeUp: true, iconBg: "bg-[#0f2b5b1a]", icon: Users },
  { label: "New Users (30 Days)", value: "1,240", change: "+12% vs last month", changeUp: true, iconBg: "bg-[#feae2c1a]", icon: UserPlus },
  { label: "Active Sessions", value: "842", subtitle: "Live tracking active", iconBg: "bg-[#2b2b401a]", icon: Activity },
]

interface AdminUser {
  name: string
  id: string
  email: string
  role: string
  roleBg: string
  roleText: string
  status: { label: string; dot: string; text: string; bg: string }
  lastActivity: string
}

const users: AdminUser[] = [
  { name: "Mateus Gonçalves", id: "SRF-00124", email: "mateus.goncalves@email.ao", role: "User", roleBg: "bg-[#dce2f3]", roleText: "text-[#44474f]", status: { label: "Active", dot: "bg-[#22c55e]", text: "text-[#15803d]", bg: "bg-[#dcfce7]" }, lastActivity: "2 mins ago" },
  { name: "Isabel dos Santos", id: "SRF-00982", email: "isabel.santos@prov.net", role: "Provider", roleBg: "bg-[#8355001a]", roleText: "text-[#835500]", status: { label: "Pending", dot: "bg-[#f59e0b]", text: "text-[#b45309]", bg: "bg-[#fef3c7]" }, lastActivity: "1 hour ago" },
  { name: "Ricardo Mendes", id: "SRF-00045", email: "ricardo.m@srfadmin.ao", role: "Admin", roleBg: "bg-[#00163c1a]", roleText: "text-[#00163c]", status: { label: "Active", dot: "bg-[#22c55e]", text: "text-[#15803d]", bg: "bg-[#dcfce7]" }, lastActivity: "14 May, 2024" },
  { name: "Elena Kuame", id: "SRF-01552", email: "elena.k@email.ao", role: "User", roleBg: "bg-[#dce2f3]", roleText: "text-[#44474f]", status: { label: "Suspended", dot: "bg-[#ef4444]", text: "text-[#b91c1c]", bg: "bg-[#fee2e2]" }, lastActivity: "12 May, 2024" },
]

const initials = (name: string) => name.split(" ").map((w) => w[0]).join("").slice(0, 2)

const avatarColors = [
  "bg-[#0f2b5b1a] text-[#00163c]", "bg-[#feae2c1a] text-[#835500]",
  "bg-[#2b2b401a] text-[#16162a]", "bg-[#dce2f3] text-[#44474f]",
]

export default function UtilizadoresPage() {
  const [page, setPage] = useState(1)

  const columns: AdminColumn<AdminUser>[] = [
    {
      key: "user",
      header: "USER",
      render: (user, i) => (
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full ${avatarColors[i]} flex items-center justify-center shrink-0 text-base font-bold`}>
            {initials(user.name)}
          </div>
          <div>
            <p className="text-[#151c27] text-base leading-tight">{user.name.replace(" ", "\n")}</p>
            <p className="text-[#44474f] text-xs mt-0.5">ID: {user.id}</p>
          </div>
        </div>
      ),
    },
    { key: "email", header: "EMAIL", render: (user) => <span className="text-[#44474f] text-base leading-tight">{user.email}</span> },
    {
      key: "role",
      header: "ROLE",
      render: (user) => (
        <span className={`${user.roleBg} ${user.roleText} text-xs font-bold rounded-full px-2 py-1`}>
          {user.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "STATUS",
      render: (user) => (
        <span className={`${user.status.bg} inline-flex items-center gap-1 text-xs font-bold rounded-full px-2 py-1`}>
          <span className={`w-1.5 h-1.5 rounded-full ${user.status.dot}`} />
          <span className={user.status.text}>{user.status.label}</span>
        </span>
      ),
    },
    { key: "lastActivity", header: "LAST ACTIVITY", render: (user) => <span className="text-[#44474f] text-base leading-tight">{user.lastActivity}</span> },
    {
      key: "acoes",
      header: "ACTIONS",
      headerClassName: "text-right",
      className: "text-right",
      render: () => (
        <div className="flex items-center justify-end gap-2">
          <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f0f3ff] transition-colors" title="Ver detalhes">
            <Eye className="w-[15px] h-[15px] text-[#44474f]" />
          </button>
          <button type="button" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f0f3ff] transition-colors" title="Mais ações">
            <MoreHorizontal className="w-4 h-4 text-[#44474f]" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-8 flex flex-col gap-6">
      <PageHeader title="Tabela De Usuários" description="Gerencie todos os utilizadores registados na plataforma." />

      <div className="flex gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="flex-1 bg-white rounded-xl p-6 border border-[#c4c6d080] shadow-sm flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-[#00163c]" />
                </div>
                {card.change && <span className="text-[#16a34a] text-xs font-bold">{card.change}</span>}
              </div>
              <div>
                <p className="text-[#44474f] text-sm font-medium tracking-[0.28px]">{card.label}</p>
                <p className="font-heading text-[32px] font-bold text-[#00163c] -tracking-[0.32px] leading-tight">{card.value}</p>
                {card.subtitle && <p className="text-[#44474f] text-xs font-medium mt-0.5">{card.subtitle}</p>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between bg-white rounded-xl border border-[#c4c6d080] shadow-sm px-6 py-4">
        <span className="font-heading text-base font-bold text-[#00163c]">Tabela De Usiarios</span>
        <div className="flex items-center gap-5">
          <Link href="/utilizadores/novo" className="flex items-center gap-2 bg-[#835501] hover:bg-[#835501]/90 text-white text-base rounded-lg px-6 py-2 transition-colors">
            <UserPlus className="w-4 h-4" />
            Adicionar Usuario
          </Link>
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={users}
        keyExtractor={(u) => u.id}
        total={12482}
        page={page}
        perPage={4}
        onPageChange={setPage}
        emptyMessage="Nenhum utilizador encontrado."
      />
    </div>
  )
}
