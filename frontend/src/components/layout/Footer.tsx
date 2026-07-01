"use client"
import Text from "../ui/text";

export default function Footer() {
  return (
    <footer className="w-full h-auto flex justify-between items-center py-2.5 px-10 bg-footer-bg text-sm">
			<Text as={"span"}>© 2026 SRF Sistema de Recomendação Financeira. All rights reserved.</Text>
			<nav className="flex gap-6">
				<a href="">Politicas de Privacidade</a>
				<a href="">Termos de Serviços</a>
				<a href="">Contactar o Suporte</a>
			</nav>
		</footer>
  );
}