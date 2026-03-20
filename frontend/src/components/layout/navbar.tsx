"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Package, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";


export function Navbar() {
  // Hook para obter a rota atual e gerenciar o estado 'ativo' dos links
  const pathname = usePathname();

  // REGRA DE EXIBIÇÃO: A barra de navegação não deve aparecer na tela de login (raiz)
  if (pathname === "/") return null;

  // CONFIGURAÇÃO DOS ITENS DO MENU: rótulo, rota de destino e ícone correspondente
  const menuItems = [
    { label: "Agenda", href: "/scheduling", icon: Calendar },
    { label: "Estoque", href: "/inventory", icon: Package },
    { label: "Financeiro", href: "/financial", icon: DollarSign },
  ];

  return (
    // Altere a tag <nav> para o seguinte:
    <nav className="h-16 border-t bg-white flex items-center justify-around px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] w-full shrink-0">

    {menuItems.map((item) => {
       
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1 w-full h-full transition-all",
              isActive ? "text-[#1E5186]" : "text-gray-400 hover:text-gray-500"
            )}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {item.label}
            </span>

            
            {isActive && (
              <div className="absolute top-0 w-12 h-1 bg-blue-600 rounded-b-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}