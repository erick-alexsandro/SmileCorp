package com.smilecorp.SmileCorp.controller;

import com.smilecorp.SmileCorp.model.Paciente;
import com.smilecorp.SmileCorp.repository.PacienteRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {
    private final PacienteRepository repo;

    public PacienteController(PacienteRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Paciente> listarTodos() {
        return repo.findAll();
    }

    @GetMapping("/search")
    public List<Paciente> search(@RequestParam String nome) {
        return repo.findByNomeContainingIgnoreCase(nome);
    }
}