package com.example.malune.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Cartao")
public class Cartao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_tipo_cartao", nullable = false)
    private TipoCartao tipoCartao;

    @Column(length = 30, nullable = false)
    private String nome;

    @Column(length = 16, unique = true, nullable = false)
    private String numeroCartao;

    @Column(nullable = false)
    private LocalDate dataValidade;
}
