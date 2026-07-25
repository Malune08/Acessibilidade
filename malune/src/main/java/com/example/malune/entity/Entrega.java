package com.example.malune.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Entrega")
public class Entrega {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "id_pedido", nullable = false, unique = true)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_endereco", nullable = false)
    private Endereco endereco;

    @Column(nullable = false)
    private LocalDate dataEstimada;
}
