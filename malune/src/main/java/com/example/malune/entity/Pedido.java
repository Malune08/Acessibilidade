package com.example.malune.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_status", nullable = false)
    private StatusPedido status;

    @Column(nullable = false)
    private LocalDate dataPedido = LocalDate.now();

    @Column(nullable = false)
    private float valorTotal;
}
