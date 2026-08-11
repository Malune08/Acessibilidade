package com.example.malune.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Endereco")
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 9, nullable = false)
    private String cep;

    @Column(length = 150, nullable = false)
    private String rua;

    @Column(length = 70, nullable = false)
    private String bairro;

    @Column(nullable = false)
    private Integer numero;

    @Column(length = 50)
    private String complemento;

    @ManyToOne // de acotdo com o banco
    @JoinColumn(name = "id_estado", nullable = false)
    private Estado estado;
}
