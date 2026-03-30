"use client";

import { Package, AlertTriangle, Edit2 } from "lucide-react";
import { ProductModal } from "./product-modal";

// Interface alinhada com a page.tsx e o backend
interface Product {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  minStock: number;
  price: number;
}

interface ProductCardProps {
  product: Product;
  onDelete?: () => void; // Função que vem da page.tsx (fetchProducts)
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  // Lógica visual para destacar falta de material
  const isLowStock = product.quantity <= product.minStock;

  return (
    <div className="bg-white border rounded-md p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Badge de Alerta de Estoque */}
      {isLowStock && (
        <div className="absolute top-0 right-0 bg-red-100 text-red-600 px-3 py-1 rounded-bl-lg flex items-center gap-1 text-xs font-bold z-10">
          <AlertTriangle className="h-3 w-3" />
          ESTOQUE BAIXO
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Ícone do Produto */}
        <div className="p-3 bg-slate-100 rounded-md text-slate-600">
          <Package className="h-6 w-6" />
        </div>
        
        {/* Informações Principais */}
        <div className="flex-1 text-left">
          <h3 className="font-bold text-slate-800 leading-tight mb-1 truncate pr-16" title={product.name}>
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 uppercase font-medium tracking-wide">
            {product.unit}
          </p>
        </div>

        {/* Modal de Edição (Onde a lixeira agora vive) */}
        <ProductModal 
          mode="edit" 
          initialData={product}
          onSuccess={onDelete} // Quando o modal salvar ou excluir, ele avisa a página
          trigger={
            <button className="p-2 hover:bg-slate-100 rounded-md text-slate-400 hover:text-[#1E293B] transition-colors outline-none border border-transparent hover:border-slate-200">
              <Edit2 className="h-4 w-4" />
            </button>
          }
        />
      </div>

      {/* Grid de Dados Numéricos */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4">
        <div className="text-left">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Quantidade</p>
          <p className={`text-lg font-bold ${isLowStock ? "text-red-600" : "text-slate-700"}`}>
            {product.quantity}
          </p>
        </div>
        <div className="text-left">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Preço Unit.</p>
          <p className="text-lg font-bold text-slate-700">
            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}