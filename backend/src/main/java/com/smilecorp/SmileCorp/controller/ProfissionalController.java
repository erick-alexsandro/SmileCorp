package com.smilecorp.SmileCorp.controller;

import com.smilecorp.SmileCorp.model.Profissional;
import com.smilecorp.SmileCorp.repository.ProfissionalRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/profissionais")
public class ProfissionalController {
    private final ProfissionalRepository repo;

    public ProfissionalController(ProfissionalRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Profissional> listarTodos() {
        return repo.findAll();
    }

    @GetMapping("/search")
    public List<Profissional> search(@RequestParam String nome) {
        return repo.findByNomeContainingIgnoreCase(nome);
    }

    @PostMapping
    public Profissional criar(@RequestBody Profissional profissional) {
        return repo.save(profissional);
    }

    @PutMapping("/{id}")
    public Profissional atualizar(@PathVariable Long id, @RequestBody Profissional profissional) {
        profissional.setId(id);
        return repo.save(profissional);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}