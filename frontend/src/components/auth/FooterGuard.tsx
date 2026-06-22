import { Lock } from "lucide-react";

export default function FooterGuard() {
  return (
    <div className="mt-xl pt-lg border-t border-outline-variant w-full">
      <div className="flex items-start gap-sm">
        <Lock
          className="text-outline mt-[2px] shrink-0"
          size={20}
          strokeWidth={2.5}
        />

        <p className="font-body-sm text-body-sm text-outline leading-tight">
          Acesso exclusivo para administradores e provedores autorizados
          do Sistema de Recomendação Financeira.
        </p>
      </div>
    </div>
  );
}