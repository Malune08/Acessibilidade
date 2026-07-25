package com.example.malune.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Status_Pagamento")
public class StatusPagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 20, unique = true, nullable = false)
    private String status;
}
