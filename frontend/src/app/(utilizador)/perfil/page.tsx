"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Settings,
  User,
  Shield,
  Key,
  ChevronRight,
  Pencil,
  Mail,
  MapPin,
  ArrowUpRight,
  Loader2,
  Check,
} from "lucide-react";

export default function PerfilPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRefazerQuestionario = () => {
    router.push("/onboarding");
  };

  const handleAlterarPassword = () => {
    alert("Redirecionar para alteração de palavra-passe");
  };

  const handleToggle2FA = () => {
    alert("Gestão de Autenticação 2FA");
  };

  return (
    <div className="flex flex-col min-h-full bg-[#ffffff]">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />

      <header className="flex items-center justify-between h-16 px-8 bg-[#f9f9ffe5] backdrop-blur-md border-b border-[#c4c6d0]">
        <h1 className="font-heading text-2xl font-bold text-primary">Perfil</h1>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#44474f]" />
            <input
              type="text"
              placeholder="Pesquisar"
              className="h-10 pl-10 pr-4 rounded-full bg-[#f0f3ff] text-sm text-foreground placeholder:text-[#6b7280] border-none outline-none focus:ring-1 focus:ring-primary/30 w-64"
            />
          </div>
          <button type="button" className="text-[#44474f] hover:text-foreground">
            <Bell className="w-5 h-5" />
          </button>
          <button type="button" className="text-[#44474f] hover:text-foreground">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 p-8">
        <div className="max-w-[976px] mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between bg-white rounded-xl p-6 border border-[#c4c6d04d] shadow-sm">
            <div className="flex items-center gap-8">
              <div className="relative shrink-0">
                <div className="w-40 h-40 rounded-xl bg-gradient-to-br from-blue-400 to-primary shadow-lg border-4 border-white overflow-hidden flex items-center justify-center text-white text-5xl font-bold">
                  MG
                </div>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="absolute bottom-[10px] right-[9px] bg-[#835500] rounded-lg p-1 shadow-md hover:opacity-90"
                >
                  <Pencil className="w-[15px] h-[13.5px] text-white" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                <span className="bg-[#feae2c33] text-[#6b4500] font-bold text-sm px-4 py-1 rounded-full w-fit">
                  Utilizador Final
                </span>
                <h2 className="font-heading text-[48px] font-bold text-primary leading-none -tracking-[0.96px]">
                  Mateus Gonçalves
                </h2>
                <p className="text-[#44474f] text-lg">
                  Membro desde Janeiro de 2023 • Luanda, Angola
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-white font-bold text-sm px-8 py-4 rounded-lg whitespace-nowrap hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> A guardar...</>
              ) : saved ? (
                <><Check className="w-4 h-4" /> Guardado</>
              ) : (
                "Guardar Alterações"
              )}
            </button>
          </div>

          <div className="flex gap-6">
            <div className="flex-1 bg-white rounded-xl p-6 border border-[#c4c6d04d] shadow-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-[#c4c6d04d] mb-6">
                <User className="w-4 h-4 text-[#835500]" />
                <h3 className="font-heading text-2xl font-semibold text-primary">
                  Informações Pessoais
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-6">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm font-medium tracking-[0.28px]">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    defaultValue="Mateus Gonçalves"
                    className="bg-[#f9f9ff] border border-[#c4c6d0] rounded-lg px-4 py-4 text-base text-[#151c27] outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm font-medium tracking-[0.28px]">
                    E-mail
                  </label>
                  <input
                    type="email"
                    defaultValue="m.goncalves@executivo.ao"
                    className="bg-[#f9f9ff] border border-[#c4c6d0] rounded-lg px-4 py-4 text-base text-[#151c27] outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm font-medium tracking-[0.28px]">
                    Número de Telefone
                  </label>
                  <div className="flex">
                    <div className="bg-[#e2e8f8] border border-[#c4c6d0] border-r-0 rounded-l-lg px-4 py-4 flex items-center">
                      <span className="text-[#151c27] text-sm font-bold">+244</span>
                    </div>
                    <input
                      type="text"
                      defaultValue="923 456 789"
                      className="flex-1 bg-[#f9f9ff] border border-[#c4c6d0] rounded-r-lg px-4 py-4 text-base text-[#151c27] outline-none focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm font-medium tracking-[0.28px]">
                    Cidade / Província
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      defaultValue="Luanda"
                      className="w-full bg-[#f9f9ff] border border-[#c4c6d0] rounded-lg px-4 py-4 text-base text-[#151c27] outline-none focus:ring-1 focus:ring-primary/30"
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="col-span-2 flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm font-medium tracking-[0.28px]">
                    Endereço de Residência
                  </label>
                  <input
                    type="text"
                    defaultValue="Condomínio Jardim de Rosas, Bloco C, Talatona"
                    className="bg-[#f9f9ff] border border-[#c4c6d0] rounded-lg px-4 py-4 text-base text-[#151c27] outline-none focus:ring-1 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>

            <div className="w-[309px] flex flex-col gap-6 shrink-0">
              <div className="relative bg-primary rounded-xl p-6 overflow-hidden shadow-lg">
                <div className="absolute w-32 h-32 rounded-full bg-white/10 -top-16 right-24" />
                <div className="flex flex-col gap-8">
                  <div className="flex items-center justify-between cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <span className="text-white/80 text-sm font-medium tracking-[0.28px]">
                        Perfil de Risco
                      </span>
                      <h4 className="font-heading text-[28px] font-bold text-white">
                        Moderado
                      </h4>
                    </div>
                    <ChevronRight className="w-6 h-6 text-[#835500]" />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                      <span className="text-white/70 text-sm font-medium tracking-[0.28px]">
                        Última Atualização
                      </span>
                      <p className="text-white font-bold text-base">
                        14 de Maio, 2024
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRefazerQuestionario}
                      className="bg-white text-[#835500] font-bold text-sm rounded-lg py-4 w-full text-center hover:opacity-90"
                    >
                      Refazer Questionário
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#c4c6d04d] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-primary font-bold text-sm tracking-[0.28px]">
                    Estado da Segurança
                  </h4>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#2e7d32]" />
                    <span className="text-[#2e7d32] text-xs font-bold">Forte</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={handleToggle2FA}
                    className="flex items-center justify-between w-full text-left hover:opacity-80"
                  >
                    <div className="flex items-center gap-4">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-[#151c27] text-sm">Autenticação 2FA</span>
                    </div>
                    <span className="text-[#2e7d32] text-sm font-bold cursor-pointer">Ativo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleAlterarPassword}
                    className="flex items-center justify-between w-full text-left hover:opacity-80"
                  >
                    <div className="flex items-center gap-4">
                      <Key className="w-[22px] h-3 text-muted-foreground" />
                      <span className="text-[#151c27] text-sm">Palavra-passe</span>
                    </div>
                    <span className="text-[#835500] text-sm font-bold cursor-pointer">Alterar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#c4c6d04d] shadow-sm">
            <div className="flex items-center gap-2 pb-4 border-b border-[#c4c6d04d] mb-6">
              <Bell className="w-[18px] h-[18px] text-[#835500]" />
              <h3 className="font-heading text-2xl font-semibold text-primary">
                Preferências de Comunicação
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <label className="flex gap-4 rounded-xl p-4 border border-[#c4c6d04d] cursor-pointer hover:bg-[#f9f9ff]">
                <div className="w-5 h-5 shrink-0 mt-0.5">
                  <div className="w-[22px] h-[22px] rounded bg-[#835500] flex items-center justify-center">
                    <Mail className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h5 className="text-primary font-bold text-sm tracking-[0.28px]">
                    Notificações por E-mail
                  </h5>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Receba relatórios semanais e alertas de mercado diretamente na sua caixa de entrada.
                  </p>
                </div>
              </label>
              <label className="flex gap-4 rounded-xl p-4 border border-[#c4c6d04d] cursor-pointer hover:bg-[#f9f9ff]">
                <div className="w-5 h-5 shrink-0 mt-0.5">
                  <div className="w-[22px] h-[22px] rounded bg-[#835500] flex items-center justify-center">
                    <ArrowUpRight className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <h5 className="text-primary font-bold text-sm tracking-[0.28px]">
                    Alertas por SMS
                  </h5>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Mensagens críticas sobre transações ou tentativas de login suspeitas.
                  </p>
                </div>
              </label>
              <label className="flex gap-4 rounded-xl p-4 border border-[#c4c6d04d] cursor-pointer hover:bg-[#f9f9ff]">
                <div className="w-5 h-5 shrink-0 mt-1">
                  <input type="checkbox" className="w-5 h-5 rounded border-[#747780] accent-[#835500]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h5 className="text-primary font-bold text-sm tracking-[0.28px]">
                    Chamadas de Consultoria
                  </h5>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Permitir que o seu gestor de conta entre em contacto para oportunidades VIP.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
