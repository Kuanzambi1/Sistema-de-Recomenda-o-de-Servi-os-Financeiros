"use client"

import { useState } from "react"
import { X, Loader2, Eye, EyeOff, Check, X as XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChangePasswordModalProps {
  open: boolean
  onClose: () => void
}

interface Requirement {
  label: string
  test: (pwd: string) => boolean
}

const requirements: Requirement[] = [
  { label: "Mínimo 8 caracteres", test: (p) => p.length >= 8 },
  { label: "Uma letra maiúscula", test: (p) => /[A-Z]/.test(p) },
  { label: "Uma letra minúscula", test: (p) => /[a-z]/.test(p) },
  { label: "Um número", test: (p) => /\d/.test(p) },
  { label: "Um caractere especial", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

function getStrength(pwd: string): { label: string; color: string; percent: number } {
  const passed = requirements.filter((r) => r.test(pwd)).length
  if (passed <= 1) return { label: "Fraca", color: "bg-red-500", percent: 20 }
  if (passed <= 2) return { label: "Regular", color: "bg-orange-500", percent: 40 }
  if (passed <= 3) return { label: "Boa", color: "bg-yellow-500", percent: 60 }
  if (passed <= 4) return { label: "Forte", color: "bg-lime-500", percent: 80 }
  return { label: "Muito Forte", color: "bg-green-500", percent: 100 }
}

export default function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  const strength = getStrength(newPassword)
  const match = newPassword === confirmPassword
  const allMet = requirements.every((r) => r.test(newPassword))
  const canSubmit = currentPassword && allMet && match && newPassword

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitting(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    onClose()
  }

  const PasswordInput = ({
    value,
    onChange,
    placeholder,
    show,
    onToggle,
    label,
  }: {
    value: string
    onChange: (v: string) => void
    placeholder: string
    show: boolean
    onToggle: () => void
    label: string
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#151c27]">{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pr-10 pl-4 rounded-lg border border-[#c4c6d0] bg-white text-sm text-[#151c27] placeholder:text-[#44474f]/60 outline-none focus:ring-2 focus:ring-[#00163c]/10 focus:border-[#00163c]"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#44474f] hover:text-[#151c27] cursor-pointer"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "#00163C66" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-[480px] bg-white rounded-xl shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#00163c]">Alterar Palavra-passe</h2>
            <p className="text-sm text-[#44474f] mt-0.5">Escolha uma password segura para a sua conta.</p>
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center text-[#44474f] hover:text-[#151c27] hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-5">
          <PasswordInput
            label="Password Atual"
            value={currentPassword}
            onChange={setCurrentPassword}
            placeholder="Insira a sua password atual"
            show={showCurrent}
            onToggle={() => setShowCurrent(!showCurrent)}
          />

          <PasswordInput
            label="Nova Password"
            value={newPassword}
            onChange={setNewPassword}
            placeholder="Insira a nova password"
            show={showNew}
            onToggle={() => setShowNew(!showNew)}
          />

          {newPassword && (
            <div className="flex flex-col gap-2 p-4 rounded-lg bg-[#f0f3ff]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#44474f] font-medium">Força da password</span>
                <span className="text-xs font-bold" style={{ color: strength.color.replace("bg-", "#").replace("red", "ef4444").replace("orange", "f97316").replace("yellow", "eab308").replace("lime", "84cc16").replace("green", "22c55e") }}>
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#c4c6d04d] overflow-hidden">
                <div className={`h-full rounded-full ${strength.color} transition-all`} style={{ width: `${strength.percent}%` }} />
              </div>
              <div className="flex flex-col gap-1 mt-1">
                {requirements.map((req) => {
                  const met = req.test(newPassword)
                  return (
                    <div key={req.label} className="flex items-center gap-2">
                      {met ? (
                        <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                      ) : (
                        <XIcon className="w-3.5 h-3.5 text-[#44474f]/40 shrink-0" />
                      )}
                      <span className={cn("text-xs", met ? "text-green-700" : "text-[#44474f]")}>
                        {req.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <PasswordInput
            label="Confirmar Nova Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Repita a nova password"
            show={showConfirm}
            onToggle={() => setShowConfirm(!showConfirm)}
          />

          {confirmPassword && !match && (
            <p className="text-xs text-red-600 -mt-3">As passwords não coincidem.</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-[#c4c6d0] text-[#151c27] text-sm hover:bg-[#f0f3ff] transition-colors">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#835500] text-white text-sm hover:bg-[#835500]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> A atualizar...</>
            ) : (
              <><Lock className="w-4 h-4" /> Atualizar Password</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function Lock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
