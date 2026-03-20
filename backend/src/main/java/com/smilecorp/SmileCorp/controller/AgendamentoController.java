package com.smilecorp.SmileCorp.controller;

import com.smilecorp.SmileCorp.model.Agendamento;
import com.smilecorp.SmileCorp.model.Paciente; // Ensure this is imported
import com.smilecorp.SmileCorp.model.Profissional;
import com.smilecorp.SmileCorp.repository.AgendamentoRepository;
import com.smilecorp.SmileCorp.repository.PacienteRepository; // Need this for find/save
import com.smilecorp.SmileCorp.repository.ProfissionalRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/agendamentos") // Matches your frontend URL
public class AgendamentoController {

    private final AgendamentoRepository repository;
    private final PacienteRepository pacienteRepository;
    private final ProfissionalRepository profissionalRepository;

    public AgendamentoController(AgendamentoRepository repository, PacienteRepository pacienteRepository, ProfissionalRepository profissionalRepository) {
        this.repository = repository;
        this.pacienteRepository = pacienteRepository;
        this.profissionalRepository = profissionalRepository;
    }

    // LISTAR TODOS COM FILTROS
    @GetMapping
    public List<Agendamento> listar(
            @RequestParam(required = false) String doctor,
            @RequestParam(required = false) String patient,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<Agendamento> all = repository.findAll();
        return all.stream().filter(a -> {
            if (doctor != null && (a.getProfissional() == null || !a.getProfissional().getNome().equals(doctor)))
                return false;
            if (patient != null && (a.getPaciente() == null
                    || !a.getPaciente().getNome().toLowerCase().contains(patient.toLowerCase())))
                return false;
            if (startDate != null && a.getData().compareTo(startDate) < 0)
                return false;
            if (endDate != null && a.getData().compareTo(endDate) > 0)
                return false;
            return true;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public Agendamento inserir(@RequestBody Map<String, Object> payload) {
        Agendamento a = new Agendamento();

        // --- 1. Lógica do Paciente --- 
        @SuppressWarnings("unchecked")
        Map<String, Object> pData = (Map<String, Object>) payload.get("paciente");
        if (pData != null) {
            if (pData.get("id") != null) {
                Long id = Long.valueOf(pData.get("id").toString());
                Paciente existing = pacienteRepository.findById(id).orElse(null);
                if (existing != null) {
                    a.setPaciente(existing);
                } else {
                    // Create new if not found
                    Paciente p = new Paciente();
                    p.setNome((String) pData.get("nome"));
                    p.setEmail((String) pData.get("email"));
                    p.setTelefone((String) pData.get("telefone"));
                    a.setPaciente(p);
                }
            } else {
                // Create new paciente
                Paciente p = new Paciente();
                p.setNome((String) pData.get("nome"));
                p.setEmail((String) pData.get("email"));
                p.setTelefone((String) pData.get("telefone"));
                a.setPaciente(p);
            }
        }

        // --- 2. Lógica do Profissional ---
        @SuppressWarnings("unchecked")
        Map<String, Object> profData = (Map<String, Object>) payload.get("profissional");
        if (profData != null) {
            if (profData.get("id") != null) {
                Long id = Long.valueOf(profData.get("id").toString());
                Profissional existing = profissionalRepository.findById(id).orElse(null);
                if (existing != null) {
                    a.setProfissional(existing);
                } else {
                    // Create new if not found
                    Profissional prof = new Profissional();
                    prof.setNome((String) profData.get("nome"));
                    // Set other fields if provided
                    if (profData.get("especialidade") != null) {
                        prof.setEspecialidade((String) profData.get("especialidade"));
                    }
                    if (profData.get("registroProfissional") != null) {
                        prof.setRegistroProfissional((String) profData.get("registroProfissional"));
                    }
                    a.setProfissional(prof);
                }
            } else {
                // Create new profissional
                Profissional prof = new Profissional();
                prof.setNome((String) profData.get("nome"));
                if (profData.get("especialidade") != null) {
                    prof.setEspecialidade((String) profData.get("especialidade"));
                }
                if (profData.get("registroProfissional") != null) {
                    prof.setRegistroProfissional((String) profData.get("registroProfissional"));
                }
                a.setProfissional(prof);
            }
        }

        // --- 3. Restante dos campos (Data, Horários, etc) ---
        a.setData((String) payload.get("data"));
        a.setHorarioInicio((String) payload.get("horarioInicio"));
        a.setPrevisaoTermino((String) payload.get("previsaoTermino"));
        a.setObservacoes((String) payload.get("observacoes"));

        // --- 4. Procedimentos ---
        List<?> procIds = (List<?>) payload.get("procedimentosIds");
        if (procIds != null) {
            a.setProcedimentosIds(procIds.stream().map(obj -> Long.valueOf(obj.toString())).toList());
        }

        return repository.save(a);
    }
}