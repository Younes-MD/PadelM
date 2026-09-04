import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LangContext";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Padel Ocaz — Raquettes de Padel d'Occasion", template: "%s | Padel Ocaz" },
  description: "Votre marketplace de confiance pour les raquettes de padel d'occasion au Maroc.",
  openGraph: { title: "Padel Ocaz", description: "Raquettes de padel d'occasion.", type: "website", locale: "fr_MA", siteName: "Padel Ocaz" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
