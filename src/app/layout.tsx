import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pontos de Encontro: São Josemaria Escrivá",
  description:
    "Uma coleção de encontros, catequeses e ensinamentos do Santo Josemaria Escrivá — sacerdote, fundador do Opus Dei e mestre da vida interior no meio do mundo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
