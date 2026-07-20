"use client"

import { Building2, MapPin, Star } from "lucide-react"

const mockProvedores = [
  { nome: "Banco de Fomento de Angola", tipo: "Banco", rating: 4.5, localizacao: "Luanda", servicos: 12 },
  { nome: "AAA Seguros", tipo: "Seguradora", rating: 4.2, localizacao: "Luanda", servicos: 8 },
  { nome: "Banco BIC", tipo: "Banco", rating: 4.0, localizacao: "Luanda", servicos: 15 },
  { nome: "ENSA Seguros", tipo: "Seguradora", rating: 3.8, localizacao: "Luanda", servicos: 6 },
  { nome: "Banco Sol", tipo: "Banco", rating: 3.5, localizacao: "Luanda", servicos: 10 },
]

export default function ProvedoresPage() {
  return (
    <div className="p-10 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[32px] font-semibold text-[#00163c] -tracking-[0.32px]">Provedores</h1>
        <p className="text-[#44474f] text-base">Instituições financeiras e seguradoras parceiras da SRF.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockProvedores.map((p) => (
          <div key={p.nome} className="bg-white rounded-xl border border-[#c4c6d0] shadow-sm p-5 flex flex-col gap-3 hover:border-[#00163c]/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f0f3ff] flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#00163c]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[#00163c] text-base font-bold truncate">{p.nome}</h3>
                <p className="text-[#44474f] text-sm">{p.tipo}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#feae2c] fill-[#feae2c]" />
                <span className="text-[#00163c] text-sm font-bold">{p.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#747780] text-xs">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.localizacao}</span>
              <span>{p.servicos} serviços disponíveis</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
