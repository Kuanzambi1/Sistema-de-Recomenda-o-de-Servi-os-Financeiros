"use client"

import { useState } from "react"
import PageHeader from "@/components/shared/PageHeader"
import ChangePasswordModal from "@/components/shared/ChangePasswordModal"
import { Lock, Shield } from "lucide-react"

export default function DefinicoesPage() {
  const [showChangePassword, setShowChangePassword] = useState(false)

  return (
    <div className="p-10 flex flex-col gap-8">
      <PageHeader
        title="Definições"
        description="Configurações gerais do sistema."
      />

      <div className="bg-white rounded-xl border border-[#c4c6d0] shadow-sm divide-y divide-[#c4c6d04d]">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#0f2b5b1a] flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#00163c]" />
            </div>
            <div>
              <p className="text-[#151c27] text-base font-medium">Alterar Palavra-passe</p>
              <p className="text-[#44474f] text-sm">Atualize a sua password de acesso ao sistema.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowChangePassword(true)}
            className="px-5 py-2 rounded-lg bg-[#835500] hover:bg-[#835500]/90 text-white text-sm transition-colors"
          >
            Alterar
          </button>
        </div>

        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-[#feae2c1a] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#835500]" />
            </div>
            <div>
              <p className="text-[#151c27] text-base font-medium">Autenticação de Dois Fatores</p>
              <p className="text-[#44474f] text-sm">Adicione uma camada extra de segurança à sua conta.</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#b45309] bg-[#fef3c7] rounded-full px-3 py-1">
            Em breve
          </span>
        </div>
      </div>

      <ChangePasswordModal
        open={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </div>
  )
}
