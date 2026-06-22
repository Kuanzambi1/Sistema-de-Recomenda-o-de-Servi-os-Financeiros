import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "SRF — Sistema de Recomendação Financeira",
    template: "%s | SRF",
  },
  description:
    "Encontra os melhores serviços financeiros de crédito e seguros adaptados ao teu perfil.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${sora.variable} ${dmSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}