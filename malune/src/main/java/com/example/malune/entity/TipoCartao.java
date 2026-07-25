package com.example.malune.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Tipo_Cartao")
public class TipoCartao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 20, unique = true, nullable = false)
    private String categoria;
}
