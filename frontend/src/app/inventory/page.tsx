"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "./components/product-card";
import { ProductModal } from "./components/product-modal";

// 1. Interface atualizada com ID para bater com o Backend Java e o ProductCard
interface Product {
  id: number; 
  name: string;
  unit: string;
  quantity: number;
  minStock: number;
  price: number;
}

export default function InventoryPage() {
  // Inicializamos o estado como um array de Product
  const [products, setProducts] = useState<Product[]>([]);
  const [filtro, setFiltro] = useState("Todos");
  const [loading, setLoading] = useState(true);

  // --- FUNÇÃO PARA BUSCAR DADOS (GET) ---
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/produtos");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Erro ao buscar produtos no servidor.");
      }
    } catch (error) {
      console.error("Erro de conexão com o backend:", error);
    } finally {
      setLoading(false);
    }
  };

  // Busca os produtos assim que a página é montada
  useEffect(() => {
    fetchProducts();
  }, []);

  // Lógica de filtragem
  const produtosFiltrados = products.filter((produto) => {
    if (filtro === "Todos") return true;
    if (filtro === "Estoque Baixo") return produto.quantity <= produto.minStock;
    if (filtro === "Estoque Normal") return produto.quantity > produto.minStock;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="flex justify-between items-end mb-8 max-w-7xl mx-auto">
        <div className="text-left">
          <h1 className="text-3xl font-bold text-[#1E293B]">Estoque de Materiais</h1>
          <p className="text-slate-500">Gestão integrada de insumos clínicos</p>
        </div>
        
        {/* Modal de Adicionar: onSuccess chama o fetchProducts para atualizar a lista */}
        <ProductModal mode="add" onSuccess={fetchProducts} />
      </header>

      {/* Barra de Filtros */}
      <div className="max-w-7xl mx-auto mb-8 flex gap-2">
        {["Todos", "Estoque Normal", "Estoque Baixo"].map((opcao) => (
          <button
            key={opcao}
            onClick={() => setFiltro(opcao)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filtro === opcao
                ? "bg-[#1E293B] text-white shadow-md"
                : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {opcao}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-medium italic">
            Carregando estoque...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtosFiltrados.map((item) => (
              <ProductCard 
                key={item.id} // Agora o item.id existe na interface e não dá erro
                product={item} 
                onDelete={fetchProducts} // Passa a função para o card atualizar a página
              />
            ))}
          </div>
        )}

        {/* Mensagem caso o filtro não retorne nada */}
        {!loading && produtosFiltrados.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-xl text-slate-400">
            Nenhum material encontrado para o filtro "{filtro}".
          </div>
        )}
      </main>
    </div>
  );
}