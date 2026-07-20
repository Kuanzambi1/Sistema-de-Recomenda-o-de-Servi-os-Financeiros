"use client"

import { useState } from "react"
import { Bell, Shield, Lock, Monitor, Smartphone, Eye, EyeOff, Download, X } from "lucide-react"

type ToggleKey =
  | "notifRecom" | "notifMercado" | "notifSeguranca"
  | "emailRecom" | "pushRecom"
  | "emailMercado" | "smsMercado"
  | "emailSeguranca" | "smsSeguranca"
  | "analiticos" | "parceiros" | "twoFactor"

export default function ConfiguracoesPage() {
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    notifRecom: true, notifMercado: true, notifSeguranca: true,
    emailRecom: true, pushRecom: false,
    emailMercado: true, smsMercado: false,
    emailSeguranca: true, smsSeguranca: true,
    analiticos: true, parceiros: false, twoFactor: true,
  })

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCur, setShowCur] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const toggle = (key: ToggleKey) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }))

  function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
    if (pw.length < 8 || !/[A-Z]/.test(pw) && !/[a-z]/.test(pw) && !/[0-9]/.test(pw) && !/[^A-Za-z0-9]/.test(pw))
      return { label: "Fraca", color: "bg-[#ba1a1a]", width: "w-1/3" }
    if (pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw) && /[0-9]/.test(pw))
      return { label: "Forte", color: "bg-[#16a34a]", width: "w-full" }
    return { label: "Média", color: "bg-[#feae2c]", width: "w-2/3" }
  }

  function handleChangePassword() {
    setPasswordError("")
    if (!currentPassword) { setPasswordError("Introduza a palavra-passe actual."); return }
    if (newPassword.length < 8) { setPasswordError("A nova palavra-passe deve ter no mínimo 8 caracteres."); return }
    if (newPassword !== confirmPassword) { setPasswordError("As palavras-passe não coincidem."); return }
    setPasswordSuccess(true)
    setTimeout(() => {
      setShowPasswordModal(false)
      setPasswordSuccess(false)
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
    }, 1500)
  }

  const strength = newPassword ? getPasswordStrength(newPassword) : null

  return (
    <div className="p-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[32px] font-semibold text-[#00163c] -tracking-[0.32px]">
          Configurações da Conta
        </h1>
        <p className="text-[#44474f] text-base max-w-[660px]">
          Gerencie suas preferências de segurança, privacidade e notificações para sua conta SRF
          Financial.
        </p>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[480px] mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#c4c6d0]">
              <div>
                <h2 className="font-heading text-lg font-semibold text-[#00163c]">
                  Alterar Palavra-passe
                </h2>
                <p className="text-[#44474f] text-sm">Escolha uma palavra-passe forte e única.</p>
              </div>
              <button
                type="button"
                onClick={() => { setShowPasswordModal(false); setPasswordError(""); setPasswordSuccess(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword("") }}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f0f3ff] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-[#44474f]" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              {passwordSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center mx-auto mb-3">
                    <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
                      <path d="M2 7.5L7.5 13L18 2" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-[#16a34a] font-medium text-sm">Palavra-passe alterada com sucesso!</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#00163c] text-sm font-medium">Palavra-passe Actual</label>
                    <div className="relative">
                      <input
                        type={showCur ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full h-11 bg-[#f0f3ff] border border-[#c4c6d0] rounded-lg px-4 pr-10 text-sm text-[#00163c] outline-none focus:border-[#00163c]"
                      />
                      <button type="button" onClick={() => setShowCur(!showCur)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showCur ? <EyeOff className="w-4 h-4 text-[#747780]" /> : <Eye className="w-4 h-4 text-[#747780]" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#00163c] text-sm font-medium">Nova Palavra-passe</label>
                    <div className="relative">
                      <input
                        type={showNew ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-11 bg-[#f0f3ff] border border-[#c4c6d0] rounded-lg px-4 pr-10 text-sm text-[#00163c] outline-none focus:border-[#00163c]"
                      />
                      <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showNew ? <EyeOff className="w-4 h-4 text-[#747780]" /> : <Eye className="w-4 h-4 text-[#747780]" />}
                      </button>
                    </div>
                    {newPassword && strength && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full bg-[#e2e8f8]">
                          <div className={`h-full rounded-full ${strength.color} ${strength.width} transition-all`} />
                        </div>
                        <span className={`text-[11px] font-medium ${
                          strength.label === "Fraca" ? "text-[#ba1a1a]" : strength.label === "Média" ? "text-[#835500]" : "text-[#16a34a]"
                        }`}>{strength.label}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[#00163c] text-sm font-medium">Confirmar Nova Palavra-passe</label>
                    <div className="relative">
                      <input
                        type={showConf ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-11 bg-[#f0f3ff] border border-[#c4c6d0] rounded-lg px-4 pr-10 text-sm text-[#00163c] outline-none focus:border-[#00163c]"
                      />
                      <button type="button" onClick={() => setShowConf(!showConf)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showConf ? <EyeOff className="w-4 h-4 text-[#747780]" /> : <Eye className="w-4 h-4 text-[#747780]" />}
                      </button>
                    </div>
                  </div>
                  {passwordError && (
                    <p className="text-[#ba1a1a] text-xs">{passwordError}</p>
                  )}
                </>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#c4c6d0] bg-[#f9f9ff]">
              <button
                type="button"
                onClick={() => { setShowPasswordModal(false); setPasswordError(""); setCurrentPassword(""); setNewPassword(""); setConfirmPassword("") }}
                className="border border-[#c4c6d0] text-[#00163c] text-sm rounded-lg px-5 py-2 hover:bg-[#f0f3ff] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword || passwordSuccess}
                className="bg-[#835500] text-white text-sm rounded-lg px-5 py-2 hover:bg-[#835500]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Alterar password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bento Grid */}
      <div className="flex flex-wrap gap-6">
        {/* Left Column - Notification Preferences */}
        <div className="w-[507px] flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-[#c4c6d0] shadow-sm p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#835500]" />
              <h2 className="font-heading text-2xl font-semibold text-[#00163c]">Preferências de Notificação</h2>
            </div>
            <div className="flex flex-col divide-y divide-[#c4c6d0]/30">
              {[
                { key: "notifRecom" as ToggleKey, title: "Novas Recomendações", desc: "Alertas sobre novas oportunidades de investimento e insights de mercado.", channels: [
                  { label: "EMAIL", k: "emailRecom" as ToggleKey }, { label: "PUSH", k: "pushRecom" as ToggleKey }
                ] },
                { key: "notifMercado" as ToggleKey, title: "Atualizações de Mercado", desc: "Resumo diário da bolsa angolana e tendências globais.", channels: [
                  { label: "EMAIL", k: "emailMercado" as ToggleKey }, { label: "SMS", k: "smsMercado" as ToggleKey }
                ] },
                { key: "notifSeguranca" as ToggleKey, title: "Alertas de Segurança", desc: "Avisos críticos sobre acessos e transações de alto valor.", channels: [
                  { label: "EMAIL", k: "emailSeguranca" as ToggleKey }, { label: "SMS", k: "smsSeguranca" as ToggleKey }
                ] },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between py-4 first:pt-0 last:pb-0">
                  <div className="max-w-[400px]">
                    <h4 className="text-[#00163c] text-sm font-bold tracking-[0.28px]">{item.title}</h4>
                    <p className="text-[#44474f] text-sm leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {item.channels.map((ch) => (
                      <ChannelToggle key={ch.k} label={ch.label} checked={toggles[ch.k]} onChange={() => toggle(ch.k)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Security + Sessions */}
        <div className="flex-1 min-w-[320px] flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-[#c4c6d0] shadow-sm p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#835500]" />
              <h2 className="font-heading text-2xl font-semibold text-[#00163c]">Segurança</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between bg-[#f0f3ff] rounded-lg border border-[#c4c6d0] p-4">
                <div>
                  <h4 className="text-[#00163c] text-sm font-bold tracking-[0.28px]">Autenticação de Dois Fatores (2FA)</h4>
                  <p className="text-[#44474f] text-sm leading-relaxed mt-0.5">Proteção extra para sua conta.</p>
                </div>
                <ToggleSwitch checked={toggles.twoFactor} onChange={() => toggle("twoFactor")} />
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center justify-center gap-2 bg-[#00163c] text-white text-base rounded-lg py-4 hover:bg-[#00163c]/90 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Lock className="w-5 h-5" />
                Alterar Palavra-passe
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#c4c6d0] shadow-sm p-6 flex flex-col gap-4">
            <h4 className="text-[#00163c] text-sm font-bold tracking-[0.28px]">Sessões Ativas</h4>
            {[
              { device: "Chrome em Luanda, AO", status: "Ativo agora • Este dispositivo", icon: Monitor, iconClass: "text-[#00163c]" },
              { device: "iPhone 15 Pro • App SRF", status: "Há 2 horas • Luanda, AO", icon: Smartphone, iconClass: "w-[15px] h-[22px] text-[#00163c]" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#e7eefe] flex items-center justify-center shrink-0">
                  <s.icon className={s.iconClass} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#00163c] text-sm font-medium tracking-[0.28px]">{s.device}</p>
                  <p className="text-[#44474f] text-sm">{s.status}</p>
                </div>
                {i > 0 && (
                  <button type="button" className="text-[#ba1a1a] text-sm hover:underline whitespace-nowrap cursor-pointer">Sair</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="bg-white rounded-xl border border-[#c4c6d0] shadow-sm p-6 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-[#835500]" />
          <h2 className="font-heading text-2xl font-semibold text-[#00163c]">Privacidade e Dados</h2>
        </div>
        <div className="flex gap-6">
          <div className="flex flex-col gap-4 flex-1">
            {[
              { k: "analiticos" as ToggleKey, title: "Partilha de Dados Analíticos", desc: "Permita que a SRF Financial utilize dados anónimos para melhorar a experiência da plataforma e novos produtos financeiros." },
              { k: "parceiros" as ToggleKey, title: "Ofertas de Parceiros", desc: "Receba ofertas exclusivas de seguros e crédito imobiliário dos nossos parceiros institucionais verificados." },
            ].map((item) => (
              <div key={item.k} className="rounded-xl bg-white border border-[#c4c6d0]/30 p-4 flex items-start gap-4">
                <div className="flex items-center justify-center w-5 h-5 mt-0.5">
                  <ToggleSwitch checked={toggles[item.k]} onChange={() => toggle(item.k)} />
                </div>
                <div>
                  <h4 className="text-[#00163c] text-sm font-bold tracking-[0.28px]">{item.title}</h4>
                  <p className="text-[#44474f] text-sm leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="w-[431px] shrink-0 bg-[#0f2b5b]/10 rounded-xl border border-[#0f2b5b]/20 p-6 flex flex-col gap-4">
            <h4 className="text-[#00163c] text-sm font-bold tracking-[0.28px]">Exportar Dados</h4>
            <p className="text-[#44474f] text-sm leading-relaxed">
              Solicite uma cópia completa de todos os seus dados pessoais e histórico financeiro armazenados em nossos servidores.
            </p>
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-[#00163c] text-[#00163c] text-base rounded-lg px-6 py-2 hover:bg-[#00163c]/5 active:scale-[0.98] transition-all cursor-pointer w-fit"
            >
              <Download className="w-[13px] h-[13px]" />
              Solicitar Arquivo JSON
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-4">
        <button type="button" className="border border-[#c4c6d0] text-[#00163c] text-base rounded-lg px-8 py-4 hover:bg-[#f0f3ff] active:scale-[0.98] transition-all cursor-pointer">Descartar Alterações</button>
        <button type="button" className="bg-[#835500] text-white text-base rounded-lg px-8 py-4 shadow-sm hover:bg-[#835500]/90 active:scale-[0.98] transition-all cursor-pointer">Guardar Configurações</button>
      </div>
    </div>
  )
}

function ChannelToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[#44474f] text-[10px] leading-relaxed">{label}</span>
      <div className={`w-[22px] h-[22px] rounded flex items-center justify-center cursor-pointer transition-colors ${checked ? "bg-[#00163c]" : "bg-white border border-[#c4c6d0]"}`} onClick={onChange}>
        {checked && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
    </div>
  )
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${checked ? "bg-[#00163c]" : "bg-[#c4c6d0]"}`} onClick={onChange}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${checked ? "left-6" : "left-1"}`} />
    </div>
  )
}
