package com.example.malune.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Item_Pedido")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "id_produto", nullable = false)
    private Produto produto;

    @Column(nullable = false)
    private float valorUnitario;

    @Column(nullable = false)
    private Integer quantidade;
}
