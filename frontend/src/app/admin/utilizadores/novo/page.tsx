"use client"

import { useRouter } from "next/navigation"
import React from "react"
import { X, Shield, ScrollText, UserCheck } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNewUserStore } from "@/store/new-user.store"

const schema = z.object({
  nome: z.string().min(3, "Mínimo de 3 caracteres"),
  email: z.string().email("Email institucional inválido"),
  telefone: z.string().min(9, "Mínimo de 9 dígitos"),
})

type FormData = z.infer<typeof schema>

export default function NovoUtilizadorPasso1() {
  const router = useRouter()
  const { step1, setStep1 } = useNewUserStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: step1 as FormData,
  })

  function onSubmit(data: FormData) {
    setStep1(data)
    router.push("/admin/utilizadores/novo/passo-2")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-10 flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between border-b border-[#c4c6d0] pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-base font-bold text-[#00163c]">
            Adicionar Novo Utilizador
          </h1>
          <p className="text-[#44474f] text-base">
            Passo 1 de 2: Informações Básicas
          </p>
        </div>
        <a
          href="/admin/utilizadores"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f0f3ff] transition-colors"
        >
          <X className="w-[14px] h-[14px] text-[#44474f]" />
        </a>
      </div>

      <div className="flex gap-2">
        <div className="h-[6px] flex-1 rounded-full bg-[#0f2b5b]" />
        <div className="h-[6px] flex-1 rounded-full bg-[#e7eefe]" />
      </div>

      <div className="flex gap-8 flex-1">
        <div className="flex-1 max-w-[520px] flex flex-col gap-6">
          <h2 className="font-heading text-base font-semibold text-[#00163c]">
            Dados do Utilizador
          </h2>

          <div className="flex flex-col gap-5">
            <InputField
              label="Nome Completo"
              error={errors.nome?.message}
              {...register("nome")}
            />
            <InputField
              label="Email Institucional"
              type="email"
              error={errors.email?.message}
              {...register("email")}
            />
            <InputField
              label="Número de Telefone"
              type="tel"
              error={errors.telefone?.message}
              {...register("telefone")}
            />
          </div>
        </div>

        <div className="w-[320px] shrink-0">
          <div className="bg-[#f0f3ff] rounded-xl border border-[#c4c6d080] p-6 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-3xl bg-[#feae2c1a] flex items-center justify-center">
              <span className="text-[#feae2c] text-2xl">ℹ</span>
            </div>
            <h3 className="font-heading text-base font-semibold text-[#00163c]">
              Sobre o Registo
            </h3>
            <p className="text-[#44474f] text-sm leading-relaxed">
              Os dados fornecidos serão utilizados para criar o perfil de acesso
              institucional do novo colaborador.
            </p>
            <p className="text-[#44474f] text-sm leading-relaxed">
              Certifique-se de que o email institucional e o número de telefone
              estão corretos para a comunicação oficial.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#f0f3ff] border-t border-[#c4c6d0] -mx-10 px-10 py-6">
        <a
          href="/admin/utilizadores"
          className="text-[#00163c] text-base font-bold rounded-xl px-8 py-4 hover:bg-white/50 transition-colors"
        >
          Cancelar
        </a>
        <button
          type="submit"
          className="bg-[#00163c] text-white text-base font-bold rounded-xl px-12 py-4 shadow-sm hover:bg-[#00163c]/90 transition-colors cursor-pointer"
        >
          Continuar
        </button>
      </div>

      <div className="flex gap-4">
        <InfoCard
          icon={Shield}
          iconBg="bg-[#ffddb4]"
          iconColor="text-[#291800]"
          title="Compliance"
          description="Padrões BNA atualizados."
        />
        <InfoCard
          icon={ScrollText}
          iconBg="bg-[#d9e2ff]"
          iconColor="text-[#001a43]"
          title="Registo de Log"
          description="Alterações monitorizadas."
        />
        <InfoCard
          icon={UserCheck}
          iconBg="bg-[#e2e0fc]"
          iconColor="text-[#1a1a2e]"
          title="Verificação"
          description="KYC Integrado."
        />
      </div>
    </form>
  )
}

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

function InputField({ label, error, ...props }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#44474f] text-sm font-medium">{label}</label>
      <input
        {...props}
        className={`h-12 bg-white border rounded-lg px-4 text-[#151c27] text-base outline-none transition-colors focus:border-[#00163c] ${
          error ? "border-red-400" : "border-[#d1d5db]"
        }`}
      />
      {error && (
        <span className="text-red-500 text-xs mt-0.5">{error}</span>
      )}
    </div>
  )
}

function InfoCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconBg: string
  iconColor: string
  title: string
  description: string
}) {
  return (
    <div className="flex-1 flex items-center gap-4 bg-white rounded-xl border border-[#c4c6d0] shadow-sm p-4">
      <div
        className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}
      >
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div>
        <p className="text-[#00163c] text-base font-bold">{title}</p>
        <p className="text-[#44474f] text-xs">{description}</p>
      </div>
    </div>
  )
}
