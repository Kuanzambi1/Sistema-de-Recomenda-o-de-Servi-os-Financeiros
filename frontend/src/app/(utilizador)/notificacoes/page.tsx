"use client"

import { Bell, Check, X } from "lucide-react"
import { useState } from "react"

const mockNotifs = [
  { id: "1", title: "Nova recomendação disponível", desc: "Um novo serviço de Crédito Pessoal foi identificado como adequado para o seu perfil.", lida: false, data: "Hoje, 14:30" },
  { id: "2", title: "Recomendação aceite com sucesso", desc: "O provedor recebeu a sua manifestação de interesse no Seguro Saúde Premium Plus.", lida: false, data: "Hoje, 10:15" },
  { id: "3", title: "Actualização de mercado", desc: "A taxa BNA de referência foi actualizada para 18.5%.", lida: true, data: "Ontem, 09:00" },
  { id: "4", title: "Perfil financeiro actualizado", desc: "As suas novas recomendações já estão disponíveis com base no perfil actualizado.", lida: true, data: "22/07/2026" },
]

export default function NotificacoesPage() {
  const [notifs, setNotifs] = useState(mockNotifs)

  function marcarLida(id: string) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, lida: true } : n))
  }

  function marcarTodasLidas() {
    setNotifs((prev) => prev.map((n) => ({ ...n, lida: true })))
  }

  const naoLidas = notifs.filter((n) => !n.lida).length

  return (
    <div className="p-10 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[32px] font-semibold text-[#00163c] -tracking-[0.32px]">Notificações</h1>
          <p className="text-[#44474f] text-base">Mantenha-se actualizado sobre as suas recomendações.</p>
        </div>
        {naoLidas > 0 && (
          <button
            type="button"
            onClick={marcarTodasLidas}
            className="border border-[#c4c6d0] text-[#00163c] text-sm rounded-lg px-4 py-2 hover:bg-[#f0f3ff] transition-colors cursor-pointer"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#44474f]">
            <Bell className="w-10 h-10 mb-3 text-[#c4c6d0]" />
            <p className="text-lg font-medium">Nenhuma notificação</p>
            <p className="text-sm">Quando houver novidades, aparecerão aqui.</p>
          </div>
        ) : (
          notifs.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 rounded-xl border p-5 transition-colors ${
                n.lida ? "bg-white border-[#c4c6d0]" : "bg-[#f0f3ff] border-[#00163c]/20"
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.lida ? "bg-[#e7eefe]" : "bg-[#00163c]"}`}>
                <Bell className={`w-4 h-4 ${n.lida ? "text-[#00163c]" : "text-white"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-bold tracking-[0.28px] ${n.lida ? "text-[#44474f]" : "text-[#00163c]"}`}>{n.title}</h4>
                  {!n.lida && <span className="w-2 h-2 rounded-full bg-[#835500] shrink-0" />}
                </div>
                <p className="text-[#44474f] text-sm leading-relaxed mt-0.5">{n.desc}</p>
                <p className="text-[#747780] text-xs mt-1">{n.data}</p>
              </div>
              {!n.lida && (
                <button
                  type="button"
                  onClick={() => marcarLida(n.id)}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#e7eefe] transition-colors cursor-pointer shrink-0"
                >
                  <Check className="w-3.5 h-3.5 text-[#00163c]" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
