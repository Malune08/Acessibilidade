package com.example.malune.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nomeCompleto;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Column(nullable = false, unique = true, length = 11)
    private String cpf;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 15)
    private String numeroTelefone;

    @Column(nullable = false, unique = true, length = 90)
    private String nomeUsuario;

    @Column(nullable = false)
    private String senha;

    @OneToOne
    @JoinColumn(name = "id_endereco")
    private Endereco endereco;

}
