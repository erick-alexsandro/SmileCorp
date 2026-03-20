package com.smilecorp.SmileCorp.controller;

import com.smilecorp.SmileCorp.model.Procedimento;
import com.smilecorp.SmileCorp.repository.ProcedimentoRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/procedimentos")
public class ProcedimentoController {

    private final ProcedimentoRepository repository;

    public ProcedimentoController(ProcedimentoRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Procedimento> listar(@RequestParam(required = false) String nome) {
        if (nome != null && !nome.isEmpty()) {
            return repository.findByNomeContainingIgnoreCase(nome);
        }
        return repository.findAll();
    }
    
}