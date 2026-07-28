package com.example.malune.entity;

import lombok.*;
import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Adm")
public class Administrador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 30, unique = true, nullable = false)
    private String nomeUsuario;

    @Column(length = 255, unique = true, nullable = false)
    private String email;

    @Column(length = 60, nullable = false)
    private String senha;
}
