"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth.store"

export default function Home() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!user) {
      router.replace("/login")
      return
    }
    const rotas: Record<string, string> = {
      utilizador: "/recomendacoes",
      provedor: "/servicos",
      admin: "/admin/dashboard",
    }
    router.replace(rotas[user.tipo] ?? "/login")
  }, [user, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )
}
