import Text from "../ui/text";

export default function Footer() {
  return (
    <footer className="w-full h-auto flex flex-col md:flex-row justify-between items-center gap-3 py-4 px-6 bg-[#0A0D14]/60 backdrop-blur-2xl border-t border-white/5 text-sm">
      <div className="text-muted-foreground">
        <Text as="span">© 2026 SRF Sistema de Recomendação Financeira. All rights reserved.</Text>
      </div>
      <nav className="flex flex-wrap gap-6">
        <a href="" className="text-muted-foreground hover:text-white hover:underline transition-colors">Políticas de Privacidade</a>
        <a href="" className="text-muted-foreground hover:text-white hover:underline transition-colors">Termos de Serviço</a>
        <a href="" className="text-muted-foreground hover:text-white hover:underline transition-colors">Contactar o Suporte</a>
      </nav>
    </footer>
  );
}