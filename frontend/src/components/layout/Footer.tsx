import Text from "../ui/text";

export default function Footer() {
  return (
    <footer className="w-full h-auto flex justify-between items-center py-3 px-6 bg-white border-t border-border text-sm">
      <div className="opacity-80">
        <Text as="span">© 2026 SRF Sistema de Recomendação Financeira. All rights reserved.</Text>
      </div>
      <nav className="flex gap-6 opacity-80">
        <a href="" className="hover:underline">Políticas de Privacidade</a>
        <a href="" className="hover:underline">Termos de Serviço</a>
        <a href="" className="hover:underline">Contactar o Suporte</a>
      </nav>
    </footer>
  );
}