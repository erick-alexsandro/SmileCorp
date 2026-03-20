package com.smilecorp.SmileCorp.repository;
import com.smilecorp.SmileCorp.model.Profissional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProfissionalRepository extends JpaRepository<Profissional, Long> {
    List<Profissional> findByNomeContainingIgnoreCase(String nome);
}