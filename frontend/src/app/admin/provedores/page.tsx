"use client"

import { useState } from "react"
import AdminTable from "@/components/shared/AdminTable"
import type { AdminColumn } from "@/components/shared/AdminTable"
import PageHeader from "@/components/shared/PageHeader"
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  X,
  Loader2,
  Eye,
} from "lucide-react"

type ProvedorStatus = "Activo" | "Pendente" | "Inactivo"

interface Provedor {
  id: string
  nome: string
  email: string
  telefone: string
  createdAt: string
  status: ProvedorStatus
  servicosCount: number
}

const mockProvedores: Provedor[] = [
  { id: "prov-1", nome: "BIC", email: "parceiros@bic.ao", telefone: "+244 222 000 000", createdAt: "15 Jan, 2025", status: "Activo", servicosCount: 2 },
  { id: "prov-2", nome: "Millennium BCP", email: "parceiros@millenniumbcp.ao", telefone: "+244 222 000 001", createdAt: "10 Fev, 2025", status: "Activo", servicosCount: 2 },
  { id: "prov-3", nome: "Standard Bank", email: "parceiros@standardbank.ao", telefone: "+244 222 000 002", createdAt: "05 Mar, 2025", status: "Activo", servicosCount: 2 },
  { id: "prov-4", nome: "BAI", email: "parceiros@bai.ao", telefone: "+244 222 000 003", createdAt: "01 Mai, 2025", status: "Activo", servicosCount: 1 },
  { id: "prov-5", nome: "Banco Sol", email: "parceiros@bancosol.ao", telefone: "+244 222 000 004", createdAt: "20 Jun, 2025", status: "Pendente", servicosCount: 0 },
  { id: "prov-6", nome: "BCI", email: "parceiros@bci.ao", telefone: "+244 222 000 005", createdAt: "15 Jul, 2025", status: "Inactivo", servicosCount: 0 },
  { id: "prov-7", nome: "Banco Economicó", email: "parceiros@bancoeconomico.ao", telefone: "+244 222 000 006", createdAt: "01 Ago, 2025", status: "Activo", servicosCount: 3 },
  { id: "prov-8", nome: "Banco Keve", email: "parceiros@bancokeve.ao", telefone: "+244 222 000 007", createdAt: "15 Ago, 2025", status: "Pendente", servicosCount: 0 },
]

const statusStyles: Record<ProvedorStatus, { dot: string; text: string; bg: string }> = {
  Activo: { dot: "bg-[#22c55e]", text: "text-[#15803d]", bg: "bg-[#dcfce7]" },
  Pendente: { dot: "bg-[#f59e0b]", text: "text-[#b45309]", bg: "bg-[#fef3c7]" },
  Inactivo: { dot: "bg-[#ef4444]", text: "text-[#b91c1c]", bg: "bg-[#fee2e2]" },
}

const initials = (name: string) => name.charAt(0).toUpperCase()

const avatarBgColors = [
  "bg-[#0f2b5b1a] text-[#00163c]",
  "bg-[#feae2c1a] text-[#835500]",
  "bg-[#2b2b401a] text-[#16162a]",
  "bg-[#dce2f3] text-[#44474f]",
  "bg-[#ffdad61a] text-[#ba1a1a]",
  "bg-[#dcfce7] text-[#15803d]",
  "bg-[#fef3c7] text-[#b45309]",
  "bg-[#e2e0fc] text-[#00163c]",
]

export default function ProvedoresPage() {
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ nome: "", email: "" })
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const filtered = mockProvedores.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleGeneratePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    let pwd = ""
    for (let i = 0; i < 12; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length))
    setGeneratedPassword(pwd)
  }

  const handleSubmit = async () => {
    if (!formData.nome || !formData.email || !generatedPassword) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSubmitting(false)
    setShowModal(false)
    setFormData({ nome: "", email: "" })
    setGeneratedPassword("")
  }

  const validForm = formData.nome.trim() && formData.email.trim() && generatedPassword

  const columns: AdminColumn<Provedor>[] = [
    {
      key: "instituicao",
      header: "INSTITUIÇÃO",
      render: (prov, i) => {
        const bgColor = avatarBgColors[i % avatarBgColors.length]
        return (
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${bgColor.split(" ")[0]} flex items-center justify-center shrink-0 text-base font-bold ${bgColor.split(" ")[1]}`}>
              {initials(prov.nome)}
            </div>
            <div>
              <p className="text-[#151c27] text-base font-medium leading-tight">{prov.nome}</p>
              <p className="text-[#44474f] text-xs mt-0.5">ID: {prov.id}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: "contacto",
      header: "CONTACTO",
      render: (prov) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-sm text-[#44474f]">
            <Mail className="w-3.5 h-3.5" /> {prov.email}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-[#44474f]">
            <Phone className="w-3.5 h-3.5" /> {prov.telefone}
          </div>
        </div>
      ),
    },
    { key: "adesao", header: "ADESÃO", render: (prov) => <span className="text-[#151c27]">{prov.createdAt}</span> },
    { key: "servicos", header: "SERVIÇOS", render: (prov) => <span className="text-[#151c27]">{prov.servicosCount} Serviços</span> },
    {
      key: "estado",
      header: "ESTADO",
      render: (prov) => {
        const st = statusStyles[prov.status]
        return (
          <span className={`${st.bg} inline-flex items-center gap-1.5 text-xs font-bold rounded-full px-3 py-1`}>
            <span className={`w-2 h-2 rounded-full ${st.dot}`} />
            <span className={st.text}>{prov.status}</span>
          </span>
        )
      },
    },
    {
      key: "acoes",
      header: "AÇÕES",
      headerClassName: "text-right",
      className: "text-right",
      render: () => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f0f3ff] transition-colors" title="Ver detalhes">
            <Eye className="w-4 h-4 text-[#44474f]" />
          </button>
          <button type="button" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f0f3ff] transition-colors" title="Mais ações">
            <MoreHorizontal className="w-4 h-4 text-[#44474f]" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-10 flex flex-col gap-8">
      <PageHeader
        title="Instituições Financeiras"
        description="Gerir provedores de serviços financeiros registados na plataforma."
        actions={
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#835500] hover:bg-[#835500]/90 text-white text-base rounded-lg px-6 py-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Criar Provedor
          </button>
        }
      />

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#44474f]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar provedores..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-white border border-[#c4c6d0] text-sm text-[#151c27] placeholder:text-[#44474f] outline-none focus:ring-2 focus:ring-[#00163c]/10 focus:border-[#00163c]"
          />
        </div>
        <button
          type="button"
          className="flex items-center gap-2 bg-white border border-[#c4c6d0] text-[#151c27] text-base rounded-lg px-4 py-2 hover:bg-[#f0f3ff] transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filtrar
        </button>
      </div>

      <AdminTable
        columns={columns}
        data={filtered}
        keyExtractor={(p) => p.id}
        total={filtered.length}
        page={1}
        perPage={10}
        emptyMessage="Nenhum provedor encontrado."
      />

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "#00163C66" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div className="w-full max-w-[480px] bg-white rounded-xl shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="font-heading text-xl font-bold text-[#00163c]">Novo Provedor</h2>
                <p className="text-sm text-[#44474f] mt-0.5">Registe uma nova instituição financeira na plataforma.</p>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="w-9 h-9 rounded-full flex items-center justify-center text-[#44474f] hover:text-[#151c27] hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 py-6 flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#151c27]">Nome da Instituição</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Banco Angolano de Investimentos"
                  className="w-full h-10 px-4 rounded-lg border border-[#c4c6d0] bg-white text-sm text-[#151c27] placeholder:text-[#44474f]/60 outline-none focus:ring-2 focus:ring-[#00163c]/10 focus:border-[#00163c]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#151c27]">Email do Provedor</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="parceiros@instituicao.ao"
                  className="w-full h-10 px-4 rounded-lg border border-[#c4c6d0] bg-white text-sm text-[#151c27] placeholder:text-[#44474f]/60 outline-none focus:ring-2 focus:ring-[#00163c]/10 focus:border-[#00163c]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#151c27]">Password Auto-gerada</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={generatedPassword}
                    readOnly
                    placeholder='Clique em "Gerar" para criar'
                    className="flex-1 h-10 px-4 rounded-lg border border-[#c4c6d0] bg-[#f0f3ff] text-sm text-[#44474f] outline-none cursor-default"
                  />
                  <button type="button" onClick={handleGeneratePassword} className="px-4 h-10 rounded-lg bg-[#00163c] text-white text-sm hover:bg-[#00163c]/90 transition-colors whitespace-nowrap">
                    Gerar
                  </button>
                </div>
                {generatedPassword && (
                  <p className="text-xs text-[#44474f] mt-1">Guarde esta password. Será necessário enviá-la ao provedor por email.</p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 rounded-lg border border-[#c4c6d0] text-[#151c27] text-sm hover:bg-[#f0f3ff] transition-colors">
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!validForm || submitting}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#835500] text-white text-sm hover:bg-[#835500]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> A criar...</>
                ) : (
                  <><Building2 className="w-4 h-4" /> Criar Provedor</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
