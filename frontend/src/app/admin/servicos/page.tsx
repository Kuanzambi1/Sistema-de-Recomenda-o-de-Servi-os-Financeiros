"use client"

import {
  Clock,
  Briefcase,
  AlertTriangle,
  TrendingUp,
  Filter,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react"

const stats = [
  {
    label: "PENDING REVIEW",
    value: "24",
    change: "+12%",
    changeUp: true,
    icon: Clock,
    iconBg: "bg-[#0f2b5b]",
    iconColor: "text-[#151c27]",
  },
  {
    label: "SERVIÇOS ATIVOS",
    value: "148",
    change: "+8%",
    changeUp: true,
    icon: Briefcase,
    iconBg: "bg-[#feae2c]",
    iconColor: "text-[#835500]",
  },
  {
    label: "ITENS SINALIZADOS",
    value: "07",
    change: "-2%",
    changeUp: false,
    icon: AlertTriangle,
    iconBg: "bg-[#ffdad6]",
    iconColor: "text-[#ba1a1a]",
  },
  {
    label: "NOVOS REGISTOS",
    value: "32",
    change: "+12%",
    changeUp: true,
    icon: TrendingUp,
    iconBg: "bg-white/10",
    iconColor: "text-white",
    variant: "dark",
  },
]

const services = [
  {
    name: "Kwanza Corporate Credit",
    id: "SRF-9921",
    provider: "Banco Millennium Atlântico",
    category: "Lending",
    status: { label: "Pending Review", dot: "bg-[#835500]", text: "text-[#835500]", bg: "bg-[#feae2c1a]" },
    submitted: "Oct 24, 2023",
    actions: "icons",
    iconType: "navy",
  },
  {
    name: "High-Yield Escrow",
    id: "SRF-8812",
    provider: "Standard Bank Angola",
    category: "Investment",
    status: { label: "Active", dot: "bg-[#151c27]", text: "text-[#151c27]", bg: "bg-[#0f2b5b1a]" },
    submitted: "Oct 20, 2023",
    actions: "view",
    iconType: "gold",
  },
  {
    name: "Offshore Flow-X",
    id: "SRF-7734",
    provider: "InterFin Solutions",
    category: "Treasury",
    status: { label: "Flagged", dot: "bg-[#ba1a1a]", text: "text-[#ba1a1a]", bg: "bg-[#ffdad633]" },
    submitted: "Oct 18, 2023",
    actions: "review",
    iconType: "red",
  },
  {
    name: "Asset-Backed Factoring",
    id: "SRF-4451",
    provider: "Angola Global Invest",
    category: "Financing",
    status: { label: "Pending Review", dot: "bg-[#835500]", text: "text-[#835500]", bg: "bg-[#feae2c1a]" },
    submitted: "Oct 15, 2023",
    actions: "icons",
    iconType: "purple",
  },
]

const iconColors: Record<string, { bg: string; icon: string }> = {
  navy: { bg: "bg-[#0f2b5b]", icon: "text-[#151c27]" },
  gold: { bg: "bg-[#feae2c]", icon: "text-[#6b4500]" },
  red: { bg: "bg-[#ffdad6]", icon: "text-[#93000a]" },
  purple: { bg: "bg-[#e2e0fc]", icon: "text-[#00163c]" },
}

export default function ServicosPage() {
  return (
    <div className="p-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[32px] font-normal text-[#00163c] -tracking-[0.32px]">
            Service Governance
          </h1>
          <p className="text-[#44474f] text-base">
            Review and manage institutional financial product submissions.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 bg-[#f0f3ff] border border-[#c4c6d0] text-[#151c27] text-base rounded-lg px-6 py-2 hover:bg-[#f0f3ff]/80 transition-colors cursor-pointer"
          >
            <Filter className="w-[15px] h-[10px]" />
            Filters
          </button>
          <button
            type="button"
            className="flex items-center gap-2 bg-[#00163c] text-white text-base rounded-lg px-6 py-2.5 hover:bg-[#00163c]/90 transition-colors cursor-pointer"
          >
            <Download className="w-[13.3px] h-[13.3px]" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`rounded-xl p-6 flex flex-col gap-1 ${
                stat.variant === "dark"
                  ? "bg-[#00163c] shadow-lg"
                  : "bg-white border border-[#c4c6d0] shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                {stat.change && (
                  <span
                    className={`text-xs font-bold ${
                      stat.changeUp ? "text-[#16a34a]" : "text-[#ba1a1a]"
                    }`}
                  >
                    {stat.change}
                  </span>
                )}
              </div>
              <p
                className={`text-sm font-medium tracking-[0.8px] mt-3 ${
                  stat.variant === "dark" ? "text-[#ffffffb2]" : "text-[#44474f]"
                }`}
              >
                {stat.label}
              </p>
              <p
                className={`font-heading text-[32px] font-bold -tracking-[0.96px] leading-none ${
                  stat.variant === "dark" ? "text-white" : "text-[#00163c]"
                }`}
              >
                {stat.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-[#c4c6d0] shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center justify-between bg-[#f0f3ff] px-6 py-4 border-b border-[#c4c6d0]">
          <h3 className="font-heading text-base font-normal text-[#00163c]">
            Service Submissions
          </h3>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-white border border-[#c4c6d0] rounded-full px-4 py-1 text-xs text-[#151c27]">
              <span className="w-2 h-2 rounded-full bg-[#835500]" />
              All Providers
            </span>
            <span className="bg-white border border-[#c4c6d0] rounded-full px-4 py-1 text-xs text-[#151c27]">
              Last 30 Days
            </span>
          </div>
        </div>

        {/* Table */}
        <table className="w-full">
          <thead>
            <tr className="bg-[#f0f3ff80]">
              {["SERVICE NAME", "PROVIDER", "CATEGORY", "STATUS", "SUBMITTED", "ACTIONS"].map((h) => (
                <th
                  key={h}
                  className={`text-left text-[#44474f] text-xs font-normal tracking-[0.6px] px-6 py-4 ${
                    h === "ACTIONS" ? "text-right" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.map((svc, i) => {
              const colors = iconColors[svc.iconType]
              const Icon = i === 0 ? Briefcase : i === 1 ? Briefcase : i === 2 ? AlertTriangle : FileText
              return (
                <tr
                  key={svc.id}
                  className={i > 0 ? "border-t border-[#c4c6d04d]" : ""}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-[26px] h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-[18px] h-4 ${colors.icon}`} />
                      </div>
                      <div>
                        <p className="text-[#00163c] text-base leading-tight whitespace-pre-line">
                          {svc.name.replace(/(?<=[a-z])\s(?=[A-Z])/, "\n")}
                        </p>
                        <p className="text-[#44474f] text-xs mt-0.5">
                          ID: {svc.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#151c27] text-base leading-tight whitespace-pre-line">
                    {svc.provider.replace(/(?<=[a-z])\s(?=[A-Z])/, "\n")}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-[#e2e8f8] text-[#00163c] text-xs rounded px-2 py-1">
                      {svc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${svc.status.bg} inline-flex items-center gap-1 text-xs rounded-full px-4 py-1`}
                    >
                      <span className={`w-[10px] h-[10px] rounded-full ${svc.status.dot}`} />
                      <span className={svc.status.text}>{svc.status.label}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#44474f] text-sm leading-tight whitespace-pre-line">
                    {svc.submitted}
                  </td>
                  <td className="px-6 py-4">
                    {svc.actions === "icons" ? (
                      <div className="flex items-center justify-end gap-2">
                        <ActionBtn icon={Eye} />
                        <ActionBtn icon={FileText} />
                        <ActionBtn icon={MoreHorizontal} />
                      </div>
                    ) : svc.actions === "view" ? (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="text-[#00163c] text-base hover:underline cursor-pointer"
                        >
                          View History
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="bg-[#ba1a1a] text-white text-xs rounded px-4 py-1 hover:bg-[#ba1a1a]/90 transition-colors cursor-pointer"
                        >
                          Review Risk
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between bg-[#f0f3ff] px-6 py-4 border-t border-[#c4c6d0]">
          <p className="text-[#44474f] text-sm">
            Showing 1 to 4 of 24 entries
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="w-8 h-8 rounded flex items-center justify-center bg-white border border-[#c4c6d0] opacity-50 cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3 text-[#44474f]" />
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded flex items-center justify-center bg-[#00163c] text-white text-sm border border-[#00163c] cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded flex items-center justify-center bg-white text-[#44474f] text-sm border border-[#c4c6d0] cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded flex items-center justify-center bg-white text-[#44474f] text-sm border border-[#c4c6d0] cursor-pointer"
            >
              3
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded flex items-center justify-center bg-white border border-[#c4c6d0] cursor-pointer"
            >
              <ChevronRight className="w-3 h-3 text-[#44474f]" />
            </button>
          </div>
        </div>
      </div>

      {/* Contextual Banner */}
      <div className="flex items-center justify-between bg-[#00163c] rounded-xl border border-[#afc6ff33] p-6">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center">
            <Shield className="w-[21px] h-[26px] text-[#151c27]" />
          </div>
          <div>
            <h4 className="font-heading text-lg font-normal text-white">
              Governance Policy Updated
            </h4>
            <p className="text-[#151c27] text-sm opacity-80 max-w-[655px] leading-relaxed">
              The risk assessment framework for &apos;Treasury&apos; category products was
              updated today. Please ensure all pending reviews in this category
              adhere to the new guidelines.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="bg-white text-[#00163c] text-base rounded-lg px-6 py-4 hover:bg-white/90 transition-colors cursor-pointer shrink-0"
        >
          Review Policy
        </button>
      </div>
    </div>
  )
}

function ActionBtn({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
  return (
    <button
      type="button"
      className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[#f0f3ff] transition-colors cursor-pointer"
    >
      <Icon className="w-[18px] h-4 text-[#44474f]" />
    </button>
  )
}
