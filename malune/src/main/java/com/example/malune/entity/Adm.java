package com.example.malune.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Adm")
public class Adm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 30, unique = true, nullable = false)
    private String nomeUsuario;

    @Column(length = 255, unique = true, nullable = false)
    private String email;

    @Column(length = 60, nullable = false)
    private String senha;
}
