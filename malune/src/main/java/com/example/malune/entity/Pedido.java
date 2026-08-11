package com.example.malune.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 10)
    private StatusPedido status = StatusPedido.AGUARDANDO;

    @Column(nullable = false)
    private LocalDate dataPedido = LocalDate.now();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;
}
