package com.example.malune.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class PedidoResumoDTO {

    private Integer id;
    private LocalDate dataPedido;
    private String status;
    private BigDecimal valorTotal;
    private List<String> produtos;
}
