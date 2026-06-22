import type { Metadata } from "next";
import "../globals.css";
import Text from "@/components/ui/text";
import Footer from "@/components/layout/Footer";




export const metadata: Metadata = {
	title: {
		default: "SRF — Sistema de Recomendação Financeira",
		template: "%s | SRF",
	},
	description:
		"Encontra os melhores serviços financeiros de crédito e seguros adaptados ao teu perfil.",
};

export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={`bg-[#F9F9FF] flex flex-col justify-between gap-10 w-full min-h-screen overflow-x-hidden pt-10 font-sans antialiased`}>
			{children}
			<Footer />
		</div>
		

	);
}