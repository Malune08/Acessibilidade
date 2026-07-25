package com.example.malune.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Forma_Pagamento")
public class FormaPagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 20, nullable = false)
    private String forma;
}
