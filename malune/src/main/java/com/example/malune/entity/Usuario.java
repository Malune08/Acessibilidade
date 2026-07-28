package com.example.malune.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 150)
    private String nomeCompleto;

    @Column(nullable = false)
    private LocalDate dataNascimento;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(unique = true, length = 15)
    private String numeroTelefone;

    @Column(nullable = false, unique = true, length = 30)
    private String nomeUsuario;

    @Column(nullable = false, length = 60)
    private String senha;

    @OneToOne
    @JoinColumn(name = "id_endereco")
    private Endereco endereco;

}