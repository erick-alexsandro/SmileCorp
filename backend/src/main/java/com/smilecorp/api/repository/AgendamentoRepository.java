package com.smilecorp.api.repository;

import com.smilecorp.api.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    
    List<Agendamento> findByOrganizacaoId(String organizacaoId);
    
    Optional<Agendamento> findByOrganizacaoIdAndId(String organizacaoId, Long id);
    
    @Query("SELECT a FROM Agendamento a WHERE a.organizacaoId = :organizacaoId AND a.data BETWEEN :startDate AND :endDate")
    List<Agendamento> findByOrganizacaoIdAndDataBetween(
            @Param("organizacaoId") String organizacaoId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT a FROM Agendamento a WHERE a.organizacaoId = :organizacaoId AND a.profissionalId = :profissionalId AND a.data BETWEEN :startDate AND :endDate")
    List<Agendamento> findByOrganizacaoIdAndProfissionalIdAndDataBetween(
            @Param("organizacaoId") String organizacaoId,
            @Param("profissionalId") String profissionalId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT a FROM Agendamento a WHERE a.organizacaoId = :organizacaoId AND a.pacienteId = :pacienteId")
    List<Agendamento> findByOrganizacaoIdAndPacienteId(
            @Param("organizacaoId") String organizacaoId,
            @Param("pacienteId") String pacienteId
    );
    
    @Query("SELECT a FROM Agendamento a WHERE a.organizacaoId = :organizacaoId AND a.profissionalId = :profissionalId")
    List<Agendamento> findByOrganizacaoIdAndProfissionalId(
            @Param("organizacaoId") String organizacaoId,
            @Param("profissionalId") String profissionalId
    );
}
