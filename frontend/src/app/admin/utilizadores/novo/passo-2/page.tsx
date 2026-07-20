"use client"

import { useRouter } from "next/navigation"
import { X, Check, Shield, ScrollText, UserCheck, ShieldAlert, ChevronRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNewUserStore } from "@/store/new-user.store"

const schema = z.object({
  perfil: z.enum(["user", "provider", "admin"]),
  permissoes: z.object({
    relatorios: z.boolean(),
    servicos: z.boolean(),
    auditoria: z.boolean(),
  }),
})

type FormData = z.infer<typeof schema>

export default function NovoUtilizadorPasso2() {
  const router = useRouter()
  const { step1, step2, setStep2, clear } = useNewUserStore()

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: step2.perfil ? step2 as FormData : {
      perfil: "provider",
      permissoes: {
        relatorios: true,
        servicos: true,
        auditoria: false,
      },
    },
  })

  const selectedPerfil = watch("perfil")
  const permissoes = watch("permissoes")

  function onSubmit(data: FormData) {
    setStep2(data)
    clear()
    router.push("/admin/utilizadores")
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-10 flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between border-b border-[#c4c6d0] pb-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-base font-bold text-[#00163c]">
            Adicionar Novo Utilizador
          </h1>
          <p className="text-[#44474f] text-base">
            Passo 2 de 2: Informações sobre o tipo de utilizador
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
        <div className="h-[6px] flex-1 rounded-full bg-[#0f2b5b]" />
      </div>

      <div className="flex gap-8 flex-1">
        <div className="flex-1 max-w-[494px] flex flex-col gap-6">
          <h2 className="font-heading text-base font-semibold text-[#00163c]">
            Selecione o Perfil do Utilizador
          </h2>

          <div className="flex flex-col gap-4">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                title={role.title}
                description={role.description}
                selected={selectedPerfil === role.id}
                onClick={() => setValue("perfil", role.id, { shouldValidate: true })}
              />
            ))}
          </div>
          {errors.perfil && (
            <span className="text-red-500 text-xs">{errors.perfil.message}</span>
          )}
        </div>

        <div className="w-[344px] shrink-0">
          <div className="bg-[#f0f3ff80] rounded-xl border border-[#c4c6d080] p-6 flex flex-col gap-6">
            <h3 className="font-heading text-base font-semibold text-[#00163c]">
              Permissões Específicas
            </h3>
            <p className="text-[#44474f] text-base leading-relaxed">
              Defina granularmente as ações
              <br />
              permitidas para este perfil.
            </p>

            <div className="flex flex-col gap-4">
              <CheckboxItem
                label="Acesso a Relatórios"
                checked={permissoes.relatorios}
                onClick={() =>
                  setValue("permissoes.relatorios", !permissoes.relatorios)
                }
              />
              <CheckboxItem
                label="Gestão de Serviços"
                checked={permissoes.servicos}
                onClick={() =>
                  setValue("permissoes.servicos", !permissoes.servicos)
                }
              />
              <CheckboxItem
                label="Auditoria de Sistema"
                checked={permissoes.auditoria}
                onClick={() =>
                  setValue("permissoes.auditoria", !permissoes.auditoria)
                }
              />
            </div>

            <div className="border-t border-[#c4c6d0] pt-4 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#835500]" />
                <span className="text-[#835500] text-base font-medium">
                  Restrições de Segurança
                </span>
              </div>
              <p className="text-[#44474f] text-xs leading-relaxed">
                As permissões de auditoria requerem autenticação de dois fatores
                obrigatória para este perfil.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#f0f3ff] border-t border-[#c4c6d0] -mx-10 px-10 py-6">
        <a
          href="/admin/utilizadores/novo"
          className="flex items-center gap-2 text-[#00163c] text-base font-bold rounded-xl px-8 py-4 hover:bg-white/50 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Voltar
        </a>
        <button
          type="submit"
          className="bg-[#00163c] text-white text-base font-bold rounded-xl px-12 py-4 shadow-sm hover:bg-[#00163c]/90 transition-colors cursor-pointer"
        >
          Concluir
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

const roles = [
  {
    id: "user" as const,
    title: "Utilizador Final",
    description: "Acesso básico para consulta de movimentos e gestão de conta pessoal.",
  },
  {
    id: "provider" as const,
    title: "Provedor Financeiro",
    description: "Acesso a ferramentas de análise de risco e gestão de transações institucionais.",
  },
  {
    id: "admin" as const,
    title: "Administrador",
    description: "Controlo total sobre configurações do sistema, utilizadores e auditoria global.",
  },
]

function RoleCard({
  title,
  description,
  selected,
  onClick,
}: {
  title: string
  description: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-4 rounded-xl border-2 p-4 cursor-pointer text-left transition-colors ${
        selected
          ? "bg-[#f0f3ff] border-[#0f2b5b]"
          : "bg-white border-[#c4c6d0] hover:border-[#0f2b5b]/30"
      }`}
    >
      <div className="shrink-0 mt-1">
        {selected ? (
          <div className="w-5 h-5 rounded-full bg-[#00163c] flex items-center justify-center">
            <Check className="w-[7.5px] h-[7.5px] text-white" />
          </div>
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-[#747780]" />
        )}
      </div>

      <div className="flex-1">
        <p className="text-[#00163c] text-base">{title}</p>
        <p className="text-[#44474f] text-base leading-relaxed mt-0.5">
          {description}
        </p>
      </div>

      <ChevronRight
        className={`w-4 h-4 mt-1 shrink-0 ${
          selected ? "text-[#00163c]" : "text-[#44474f]"
        }`}
      />
    </button>
  )
}

function CheckboxItem({
  label,
  checked,
  onClick,
}: {
  label: string
  checked: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-4 cursor-pointer text-left"
    >
      {checked ? (
        <div className="w-[26px] h-[26px] -ml-[3px] rounded-md bg-[#00163c] flex items-center justify-center shrink-0">
          <Check className="w-[13.5px] h-[10.5px] text-white" />
        </div>
      ) : (
        <div className="w-6 h-6 rounded-md border border-[#c4c6d0] bg-white shrink-0" />
      )}
      <span className="text-[#151c27] text-base">{label}</span>
    </button>
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
