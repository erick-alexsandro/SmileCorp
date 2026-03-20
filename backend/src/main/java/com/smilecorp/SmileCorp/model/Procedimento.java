package com.smilecorp.SmileCorp.model;

import jakarta.persistence.*;

@Entity
public class Procedimento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Integer duracao; // In minutes (e.g., 30, 60)
    private Double preco;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Integer getDuracao() { return duracao; }
    public void setDuracao(Integer duracao) { this.duracao = duracao; }
    public Double getPreco() { return preco; }
    public void setPreco(Double preco) { this.preco = preco; }
}