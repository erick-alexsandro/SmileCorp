"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose, // Importante para fechar o modal após excluir
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, DollarSign, Trash2, Save } from "lucide-react";

interface ProductModalProps {
  trigger?: React.ReactNode;
  mode: "add" | "edit";
  initialData?: {
  id: number; // Adicione o ID aqui
  name: string;
  unit: string;
  quantity: number;
  minStock: number;
  price: number;
  };
  onSuccess?: () => void; // Prop para atualizar a lista na página
}

export function ProductModal({ trigger, mode, initialData, onSuccess }: ProductModalProps) {
  const isEdit = mode === "edit";

  // --- ESTADOS ---
  const [nome, setNome] = useState(initialData?.name || "");
  const [unidade, setUnidade] = useState(initialData?.unit || "");
  const [preco, setPreco] = useState(initialData?.price?.toString() || "");
  const [quantidade, setQuantidade] = useState(initialData?.quantity?.toString() || "");
  const [minCritico, setMinCritico] = useState(initialData?.minStock?.toString() || "");
  const [loading, setLoading] = useState(false); // Estado para feedback visual

  // Sincroniza os campos quando o initialData muda
  useEffect(() => {
    if (isEdit && initialData) {
      setNome(initialData.name);
      setUnidade(initialData.unit);
      setPreco(initialData.price.toString());
      setQuantidade(initialData.quantity.toString());
      setMinCritico(initialData.minStock.toString());
    } else {
        // Limpa os campos se for modo "add"
        setNome("");
        setUnidade("");
        setPreco("");
        setQuantidade("");
        setMinCritico("");
    }
  }, [initialData, isEdit]);

  // Validação simples para habilitar o botão Salvar
  const formularioValido =
    nome.trim().length > 0 &&
    unidade !== "" &&
    preco !== "" &&
    quantidade !== "";

  // --- FUNÇÃO PARA SALVAR/EDITAR (POST/PUT) ---
  const handleSalvar = async () => {
    setLoading(true);
    const dadosProduto = {
      nome,
      unidade,
      preco: Number(preco),
      quantidade: Number(quantidade),
      minimoCritico: Number(minCritico),
    };
    
    try {
      // Ajuste a URL conforme o seu backend Java
      const url = isEdit 
        ? `http://localhost:8080/api/produtos/${initialData?.id}` 
        : "http://localhost:8080/api/produtos";
      
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosProduto),
      });

      if (response.ok) {
        alert(isEdit ? "Produto atualizado com sucesso!" : "Produto cadastrado com sucesso!");
        onSuccess?.(); // Recarrega a lista na página principal
        // Se for cadastro, limpa os campos
        if (!isEdit) {
            setNome("");
            setUnidade("");
            setPreco("");
            setQuantidade("");
            setMinCritico("");
        }
      } else {
        alert("Erro na operação com o servidor.");
      }
    } catch (error) {
      console.error("Erro de conexão:", error);
      alert("Não foi possível conectar ao servidor.");
    } finally {
        setLoading(false);
    }
  };

  // --- NOVA FUNÇÃO PARA EXCLUIR (DELETE) ---
  const handleExcluir = async () => {
    // Confirmação de segurança
    if (confirm(`Tem certeza absoluta que deseja excluir "${initialData?.name}" do estoque?`)) {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/produtos/${initialData?.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Material removido com sucesso!");
          onSuccess?.(); // Recarrega a lista na página principal
          // O modal fechará automaticamente por causa do DialogClose no footer
        } else {
          alert("Erro ao excluir o material. Verifique se ele não está sendo usado.");
        }
      } catch (error) {
        console.error("Erro de conexão ao excluir:", error);
        alert("Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger className={isEdit ? "" : "fixed bottom-8 right-8 h-14 w-14 rounded-full bg-[#1E293B] flex items-center justify-center text-white shadow-xl z-50 hover:bg-[#0F172A] transition-all active:scale-95 outline-none"}>
        {isEdit ? (
          trigger
        ) : (
          <Plus className="h-7 w-7" strokeWidth={3} />
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-left flex items-center gap-2">
            {isEdit ? "Editar Material" : "Novo Material"}
          </DialogTitle>
          <DialogDescription className="text-left">
            {isEdit
              ? "Atualize as informações ou exclua o item selecionado."
              : "Preencha os dados para cadastrar um novo item no estoque."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-5">
          {/* Nome do Material */}
          <div className="grid gap-2 text-left">
            <Label htmlFor="nome">
              Nome do Material<span className="text-red-500">*</span>
            </Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Resina Filtek Z350"
              autoComplete="off"
            />
          </div>

          {/* Linha: Unidade e Preço */}
          <div className="flex gap-3 w-full items-start">
            <div className="grid gap-2 flex-1 text-left">
              <Label htmlFor="unidade-select">Unidade<span className="text-red-500">*</span></Label>
              <select
                id="unidade-select"
                value={unidade}
                onChange={(e) => setUnidade(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Selecione</option>
                {["Unidade", "Caixa", "Rolo", "Pacote", "Mililitros"].map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-2 flex-1 text-left">
              <Label htmlFor="preco">Preço Compra</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="preco"
                  type="number"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="0,00"
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          {/* Linha: Quantidade e Estoque Mínimo */}
          <div className="flex gap-3 w-full items-start">
            <div className="grid gap-2 flex-1 text-left">
              <Label htmlFor="qty">
                {isEdit ? "Estoque Atual" : "Qtd Inicial"}<span className="text-red-500">*</span>
              </Label>
              <Input
                id="qty"
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="grid gap-2 flex-1 text-left">
              <Label htmlFor="min">Mín. Crítico</Label>
              <Input
                id="min"
                type="number"
                value={minCritico}
                onChange={(e) => setMinCritico(e.target.value)}
                placeholder="5"
              />
            </div>
          </div>
        </div>

        {/* --- FOOTER: AÇÕES --- */}
        <div className="flex justify-between items-center gap-2 border-t pt-4">
          {/* Lado Esquerdo: Se for edição, mostra Excluir. Se não, renderiza uma div vazia para manter o Salvar na direita */}
          {isEdit ? (
            <DialogClose 
              onClick={handleExcluir}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Excluir Material
            </DialogClose>
          ) : (
            <div /> 
          )}

          {/* Lado Direito: Botão Salvar */}
          <Button
            type="button"
            onClick={handleSalvar}
            disabled={!formularioValido || loading}
            className={`gap-2 bg-[#1E293B] hover:bg-[#0F172A] ${!formularioValido || loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Save className="h-4 w-4" />
            {isEdit ? "Salvar Alterações" : "Cadastrar no Estoque"}
          </Button>
        </div>
          
      </DialogContent>
    </Dialog>
  );
}