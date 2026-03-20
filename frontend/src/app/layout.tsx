import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";

// --- CONFIGURAÇÃO DE FONTES ---
// Configuração da Inter como fonte padrão para manter a consistência visual do sistema
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- METADADOS DO SISTEMA ---
export const metadata: Metadata = {
  title: "SmileCorp - Gestão Odontológica",
  description: "Sistema inteligente de gestão de estoque e finanças",
};

// src/app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="pt-BR" className={cn("font-sans", inter.variable)}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-screen`}>
        
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <Navbar />
      </body>
    </html>
  );
}