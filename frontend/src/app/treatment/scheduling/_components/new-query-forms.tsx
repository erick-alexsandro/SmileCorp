"use client";

import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function NewQueryForms() {
  // --- 1. ÁREA DE MEMÓRIA (ESTADOS - DADOS DO FORMULÁRIO) ---
  const [idPaciente, setIdPaciente] = useState<number | null>(null);
  const [nomePaciente, setNomePaciente] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const [dataConsulta, setDataConsulta] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [previsaoTermino, setPrevisaoTermino] = useState("");
  const [idProfissional, setIdProfissional] = useState<number | null>(null);
  const [profissional, setProfissional] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [procedimentosSelecionados, setProcedimentosSelecionados] = useState<
    any[]
  >([]);

  // --- 2. ÁREA DE UI (BUSCAS E SUGESTÕES) ---
  const [buscaProcedimento, setBuscaProcedimento] = useState("");
  const [sugestoes, setSugestoes] = useState<any[]>([]);
  const [sugestoesProfissionais, setSugestoesProfissionais] = useState<any[]>(
    [],
  );
  const [sugestoesProcedimentos, setSugestoesProcedimentos] = useState<any[]>(
    [],
  );

  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [mostrarSugestoesProf, setMostrarSugestoesProf] = useState(false);

  // --- 3. ÁREA DE REGRAS (EFEITOS - useEffect) ---

  // Regra 1: Busca de Pacientes (com Debounce)
  useEffect(() => {
    const buscarPacientes = async () => {
      if (nomePaciente.length > 0 && mostrarSugestoes) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/pacientes/search?nome=${nomePaciente}`,
          );
          const dados = await response.json();
          setSugestoes(dados);
        } catch (error) {
          console.error("Erro ao buscar pacientes:", error);
          setSugestoes([]);
        }
      } else {
        setSugestoes([]);
      }
    };

    const timer = setTimeout(buscarPacientes, 300);
    return () => clearTimeout(timer);
  }, [nomePaciente, mostrarSugestoes]);

  // Regra 2: Busca de Profissionais (com Debounce)
  useEffect(() => {
    const buscarProfissionais = async () => {
      if (profissional.length > 0 && mostrarSugestoesProf) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/profissionais/search?nome=${profissional}`,
          );
          const dados = await response.json();
          setSugestoesProfissionais(dados);
        } catch (error) {
          console.error("Erro ao buscar profissionais:", error);
          setSugestoesProfissionais([]);
        }
      } else {
        setSugestoesProfissionais([]);
      }
    };

    const timer = setTimeout(buscarProfissionais, 300);
    return () => clearTimeout(timer);
  }, [profissional, mostrarSugestoesProf]);

  // Regra 3: Busca de Procedimentos (Execução imediata)
  useEffect(() => {
    const buscarProcedimentos = async () => {
      if (buscaProcedimento.length > 0) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/procedimentos?nome=${buscaProcedimento}`,
          );
          const dados = await response.json();
          setSugestoesProcedimentos(dados);
        } catch (error) {
          console.error("Erro ao buscar procedimentos:", error);
          setSugestoesProcedimentos([]);
        }
      } else {
        setSugestoesProcedimentos([]);
      }
    };
    buscarProcedimentos();
  }, [buscaProcedimento]);

  // Regra 4: Cálculo da Previsão de Término
  useEffect(() => {
    console.log("Checking calculation...", {
      horarioInicio,
      count: procedimentosSelecionados.length,
    });

    if (horarioInicio && procedimentosSelecionados.length > 0) {
      // 1. Calculate total duration
      const duracaoTotal = procedimentosSelecionados.reduce(
        (acc, p) => acc + (Number(p.duracao) || 30),
        0,
      );

      // 2. Parse start time
      const [strHoras, strMinutos] = horarioInicio.split(":");
      const horas = parseInt(strHoras, 10);
      const minutos = parseInt(strMinutos, 10);

      if (!isNaN(horas) && !isNaN(minutos)) {
        // 3. Math for the end time
        let totalMinutos = horas * 60 + minutos + duracaoTotal;
        const h = Math.floor(totalMinutos / 60) % 24;
        const m = totalMinutos % 60;

        const resultado = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        console.log("Success! Previsão:", resultado);
        setPrevisaoTermino(resultado);
      }
    } else {
      setPrevisaoTermino("");
    }
  }, [procedimentosSelecionados, horarioInicio]);

  // Regra 5: Global - Fecha as listas ao clicar fora da área
  useEffect(() => {
    const fecharListas = () => {
      setTimeout(() => {
        setMostrarSugestoes(false);
        setMostrarSugestoesProf(false);
      }, 200);
    };
    document.addEventListener("click", fecharListas);
    return () => document.removeEventListener("click", fecharListas);
  }, []);

  // --- 4. FUNÇÕES DE AÇÃO E FORMATAÇÃO ---

  const aplicarMascaraTelefone = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    return apenasNumeros
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15);
  };

  const handleSalvarAgendamento = async () => {
    const agendamentoCompleto = {
      paciente: {
        id: idPaciente,
        nome: nomePaciente,
        email: email,
        telefone: telefone,
      },
      data: dataConsulta,
      horarioInicio: horarioInicio,
      previsaoTermino: previsaoTermino,
      procedimentosIds: procedimentosSelecionados.map((p) => p.id),

      // ALTERAÇÃO AQUI: Enviar como objeto para casar com o @ManyToOne
      profissional: {
        id: idProfissional,
        nome: profissional,
      },

      observacoes: observacoes,
    };

    try {
      const response = await fetch("http://localhost:8080/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agendamentoCompleto), // Now this matches the Java Entity
      });
      // ... rest of your logic

      if (response.ok) {
        alert("Agendamento salvo com sucesso!");
        // Limpeza dos campos após sucesso
        setNomePaciente("");
        setEmail("");
        setTelefone("");
        setIdPaciente(null);
        setProcedimentosSelecionados([]);
        setHorarioInicio("");
        setPrevisaoTermino("");
        setProfissional("");
        setDataConsulta("");
        setObservacoes("");
      } else {
        alert("Erro ao salvar agendamento.");
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      alert("Servidor offline ou erro de rede.");
    }
  };

  // --- 5. VALIDAÇÃO DE FORMULÁRIO ---
  // --- 5. VALIDAÇÃO DE FORMULÁRIO ---
  const formularioValido =
    nomePaciente.trim().length > 0 &&
    telefone.replace(/\D/g, "").length >= 10 &&
    dataConsulta !== "" &&
    horarioInicio !== "" &&
    profissional.trim().length > 0 &&
    procedimentosSelecionados.length > 0; // Removed the check for previsaoTermino
  return (
    <Dialog>
      {/* --- BOTÃO DE ABERTURA --- */}
      <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        Agendar Nova Consulta
      </DialogTrigger>

      <DialogContent className="sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Nova Consulta</DialogTitle>
        </DialogHeader>

        <div className="grid gap-10 py-5">
          {/* --- BLOCO 1: DADOS BÁSICOS DO PACIENTE --- */}
          <div className="flex gap-3 w-full">
            {/* Campo: Nome do Paciente (com sugestões) */}
            <div
              className="grid gap-2 flex-1 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Label htmlFor="paciente">
                Paciente<span className="text-red-500">*</span>
              </Label>
              <Input
                id="paciente"
                type="text"
                value={nomePaciente}
                onChange={(e) => {
                  setNomePaciente(e.target.value);
                  setMostrarSugestoes(true);
                }}
                onFocus={() => setMostrarSugestoes(true)}
                autoComplete="off"
              />

              {/* Lista de Sugestões de Pacientes */}
              {mostrarSugestoes && nomePaciente.length > 0 && (
                <ul className="absolute top-full z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                  {sugestoes.length > 0 ? (
                    sugestoes.map((sugestao, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-slate-100 cursor-pointer text-sm text-black font-medium"
                        onClick={() => {
                          setNomePaciente(sugestao.nome);
                          setEmail(sugestao.email || "");
                          setTelefone(
                            aplicarMascaraTelefone(sugestao.telefone || ""),
                          );
                          setIdPaciente(sugestao.id);
                          setSugestoes([]);
                          setMostrarSugestoes(false);
                        }}
                      >
                        {sugestao.nome}
                      </li>
                    ))
                  ) : (
                    <li className="p-3 text-sm text-gray-500 italic bg-gray-50">
                      Não encontramos nenhum paciente com esse nome.
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Campo: E-mail */}
            <div className="grid gap-2 flex-1">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Campo: Telefone */}
            <div className="grid gap-2 flex-1">
              <Label htmlFor="telefone">
                Telefone<span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={(e) =>
                  setTelefone(aplicarMascaraTelefone(e.target.value))
                }
                placeholder="(xx) xxxxx-xxxx"
              />
            </div>
          </div>

          {/* --- BLOCO 2: DATA E HORÁRIOS --- */}
          <div className="flex gap-3 w-full">
            <div className="grid gap-2 flex-1">
              <Label htmlFor="data-consulta">
                Data<span className="text-red-500">*</span>
              </Label>
              <Input
                id="data-consulta"
                type="date"
                value={dataConsulta}
                onChange={(e) => setDataConsulta(e.target.value)}
              />
            </div>

            <div className="grid gap-2 flex-1">
              <Label htmlFor="inicio">
                Horário de início<span className="text-red-500">*</span>
              </Label>
              <Input
                id="inicio"
                type="time"
                value={horarioInicio}
                onChange={(e) => setHorarioInicio(e.target.value)}
              />
            </div>

            <div className="grid gap-2 flex-1">
              <Label htmlFor="termino">
                Previsão do término<span className="text-red-500">*</span>
              </Label>
              <Input
                id="termino"
                type="time"
                value={previsaoTermino}
                readOnly
              />
            </div>
          </div>

          {/* --- BLOCO 3: SERVIÇOS E PROFISSIONAL --- */}
          <div className="flex gap-3 w-full items-start">
            {/* Campo: Busca de Procedimentos */}
            <div className="grid gap-2 flex-1 relative">
              <Label>
                Procedimentos<span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Buscar procedimento..."
                value={buscaProcedimento}
                onChange={(e) => setBuscaProcedimento(e.target.value)}
                autoComplete="off"
              />

              {/* Sugestões de Procedimentos */}
              {sugestoesProcedimentos.length > 0 && (
                <ul className="absolute top-full z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                  {sugestoesProcedimentos.map((p) => (
                    <li
                      key={p.id}
                      className="p-2 hover:bg-slate-100 cursor-pointer text-sm"
                      onClick={() => {
                        if (
                          !procedimentosSelecionados.find(
                            (item) => item.id === p.id,
                          )
                        ) {
                          setProcedimentosSelecionados([
                            ...procedimentosSelecionados,
                            // Explicitly spread p to ensure 'duracao' is included
                            { ...p },
                          ]);
                        }
                        setBuscaProcedimento("");
                        setSugestoesProcedimentos([]);
                      }}
                    >
                      {p.nome} ({p.duracao}min)
                    </li>
                  ))}
                </ul>
              )}

              {/* Badges de Procedimentos Selecionados */}
              <div className="flex flex-wrap gap-2 mt-2">
                {procedimentosSelecionados.map((p) => (
                  <span
                    key={p.id}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    {p.nome}
                    <button
                      type="button"
                      onClick={() =>
                        setProcedimentosSelecionados(
                          procedimentosSelecionados.filter(
                            (i) => i.id !== p.id,
                          ),
                        )
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Campo: Profissional (com sugestões) */}
            <div
              className="grid gap-2 flex-1 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Label htmlFor="profissional">
                Profissional <span className="text-red-500">*</span>
              </Label>
              <Input
                id="profissional"
                type="text"
                value={profissional}
                onChange={(e) => {
                  setProfissional(e.target.value);
                  setMostrarSugestoesProf(true);
                }}
                onFocus={() => setMostrarSugestoesProf(true)}
                autoComplete="off"
                placeholder="Buscar dentista..."
              />

              {/* Lista de Sugestões de Profissionais */}
              {mostrarSugestoesProf && profissional.length > 0 && (
                <ul className="absolute top-full z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                  {sugestoesProfissionais.length > 0 ? (
                    sugestoesProfissionais.map((prof, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-slate-100 cursor-pointer text-sm text-black font-medium"
                        onClick={() => {
                          setProfissional(prof.nome); // Mantém o nome no input
                          setIdProfissional(prof.id); // NOVO: Guarda o ID para o banco
                          setMostrarSugestoesProf(false);
                        }}
                      >
                        {prof.nome}
                      </li>
                    ))
                  ) : (
                    <li className="p-3 text-sm text-gray-500 italic bg-gray-50">
                      Não encontramos nenhum profissional.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* --- BLOCO 4: OBSERVAÇÕES --- */}
          <div className="grid gap-2">
            <Label htmlFor="obs">Observações</Label>
            <Textarea
              id="obs"
              placeholder="Digite detalhes adicionais sobre a consulta..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="h-32 resize-y"
            />
          </div>
        </div>

        {/* --- RODAPÉ: AÇÕES --- */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            onClick={handleSalvarAgendamento}
            disabled={!formularioValido}
            className={!formularioValido ? "opacity-50 cursor-not-allowed" : ""}
          >
            Salvar Agendamento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
