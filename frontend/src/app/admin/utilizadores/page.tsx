"use client"

import Link from "next/link"
import {
  Users,
  UserPlus,
  Activity,
  Filter,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const statCards = [
  {
    label: "Total Users",
    value: "12,482",
    change: "+8.4%",
    changeUp: true,
    iconBg: "bg-[#0f2b5b1a]",
    icon: Users,
  },
  {
    label: "New Users (30 Days)",
    value: "1,240",
    change: "+12% vs last month",
    changeUp: true,
    iconBg: "bg-[#feae2c1a]",
    icon: UserPlus,
  },
  {
    label: "Active Sessions",
    value: "842",
    subtitle: "Live tracking active",
    iconBg: "bg-[#2b2b401a]",
    icon: Activity,
  },
]

const users = [
  {
    name: "Mateus Gonçalves",
    id: "SRF-00124",
    email: "mateus.goncalves@email.ao",
    role: "User",
    roleBg: "bg-[#dce2f3]",
    roleText: "text-[#44474f]",
    status: { label: "Active", dot: "bg-[#22c55e]", text: "text-[#15803d]", bg: "bg-[#dcfce7]" },
    lastActivity: "2 mins ago",
  },
  {
    name: "Isabel dos Santos",
    id: "SRF-00982",
    email: "isabel.santos@prov.net",
    role: "Provider",
    roleBg: "bg-[#8355001a]",
    roleText: "text-[#835500]",
    status: { label: "Pending", dot: "bg-[#f59e0b]", text: "text-[#b45309]", bg: "bg-[#fef3c7]" },
    lastActivity: "1 hour ago",
  },
  {
    name: "Ricardo Mendes",
    id: "SRF-00045",
    email: "ricardo.m@srfadmin.ao",
    role: "Admin",
    roleBg: "bg-[#00163c1a]",
    roleText: "text-[#00163c]",
    status: { label: "Active", dot: "bg-[#22c55e]", text: "text-[#15803d]", bg: "bg-[#dcfce7]" },
    lastActivity: "14 May, 2024",
  },
  {
    name: "Elena Kuame",
    id: "SRF-01552",
    email: "elena.k@email.ao",
    role: "User",
    roleBg: "bg-[#dce2f3]",
    roleText: "text-[#44474f]",
    status: { label: "Suspended", dot: "bg-[#ef4444]", text: "text-[#b91c1c]", bg: "bg-[#fee2e2]" },
    lastActivity: "12 May, 2024",
  },
]

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)

const avatarColors = [
  "bg-[#0f2b5b1a] text-[#00163c]",
  "bg-[#feae2c1a] text-[#835500]",
  "bg-[#2b2b401a] text-[#16162a]",
  "bg-[#dce2f3] text-[#44474f]",
]

export default function UtilizadoresPage() {
  return (
    <div className="p-8 flex flex-col gap-6">
      <h1 className="font-heading text-[26px] font-bold text-[#000] tracking-tight">
        Tabela De Usiarios
      </h1>

      <div className="flex gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="flex-1 bg-white rounded-xl p-6 border border-[#c4c6d080] shadow-sm flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-[#00163c]" />
                </div>
                {card.change && (
                  <span className="text-[#16a34a] text-xs font-bold">
                    {card.change}
                  </span>
                )}
              </div>
              <div>
                <p className="text-[#44474f] text-sm font-medium tracking-[0.28px]">
                  {card.label}
                </p>
                <p className="font-heading text-[32px] font-bold text-[#00163c] -tracking-[0.32px] leading-tight">
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="text-[#44474f] text-xs font-medium mt-0.5">
                    {card.subtitle}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-xl border border-[#c4c6d080] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c4c6d04d]">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#00163c]" />
            <span className="font-heading text-base font-bold text-[#00163c]">
              Tabela De Usiarios
            </span>
          </div>
          <div className="flex items-center gap-5">
            <button
              type="button"
              className="flex items-center gap-2 bg-[#dce2f3] hover:bg-[#dce2f3]/80 text-[#00163c] text-base rounded-lg px-6 py-2 transition-colors cursor-pointer"
            >
              <Filter className="w-[13px] h-[13px]" />
              Export CSV
            </button>
            <Link
              href="/utilizadores/novo"
              className="flex items-center gap-2 bg-[#835501] hover:bg-[#835501]/90 text-white text-base rounded-lg px-6 py-2 transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Adicionar Usuario
            </Link>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-[#f0f3ff80]">
              {["USER", "EMAIL", "ROLE", "STATUS", "LAST ACTIVITY", "ACTIONS"].map((h) => (
                <th
                  key={h}
                  className={`text-left text-[#44474f] text-xs font-bold tracking-[0.55px] px-6 py-[23px] ${
                    h === "ACTIONS" ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr
                key={user.id}
                className={i > 0 ? "border-t border-[#c4c6d033]" : ""}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full ${avatarColors[i]} flex items-center justify-center shrink-0 text-base font-bold`}
                    >
                      {initials(user.name)}
                    </div>
                    <div>
                      <p className="text-[#151c27] text-base leading-tight whitespace-pre-line">
                        {user.name.replace(" ", "\n")}
                      </p>
                      <p className="text-[#44474f] text-xs mt-0.5">
                        ID: {user.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#44474f] text-base leading-tight">
                  {user.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`${user.roleBg} ${user.roleText} text-xs font-bold rounded-full px-2 py-1`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`${user.status.bg} inline-flex items-center gap-1 text-xs font-bold rounded-full px-2 py-1`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status.dot}`} />
                    <span className={user.status.text}>{user.status.label}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-[#44474f] text-base leading-tight">
                  {user.lastActivity}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f0f3ff] transition-colors cursor-pointer"
                      title="Ver detalhes"
                    >
                      <Eye className="w-[15px] h-[15px] text-[#44474f]" />
                    </button>
                    <button
                      type="button"
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f0f3ff] transition-colors cursor-pointer"
                      title="Mais ações"
                    >
                      <MoreHorizontal className="w-[3.3px] h-[13.3px] text-[#44474f]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#c4c6d04d]">
          <p className="text-[#44474f] text-base">
            Showing 1 - 4 of 12,482 users
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#c4c6d0] opacity-30 cursor-pointer"
              disabled
            >
              <ChevronLeft className="w-[5.5px] h-[9px] text-[#44474f]" />
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#00163c] text-white text-base cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#c4c6d0] text-base cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#c4c6d0] text-base cursor-pointer"
            >
              3
            </button>
            <span className="px-1 text-[#44474f] text-base">...</span>
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#c4c6d0] text-base cursor-pointer"
            >
              10
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#c4c6d0] cursor-pointer"
            >
              <ChevronRight className="w-[5.5px] h-[9px] text-[#44474f]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
