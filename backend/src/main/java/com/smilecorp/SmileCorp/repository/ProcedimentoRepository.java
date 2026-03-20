package com.smilecorp.SmileCorp.repository;

import com.smilecorp.SmileCorp.model.Procedimento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProcedimentoRepository extends JpaRepository<Procedimento, Long> {
    // This allows the "Search" bar in your frontend to work
    List<Procedimento> findByNomeContainingIgnoreCase(String nome);
}