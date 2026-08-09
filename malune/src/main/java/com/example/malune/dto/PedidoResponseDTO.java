package com.example.malune.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PedidoResponseDTO {
    private Integer idPedido;
    private Integer idPagamento;
    private String statusPagamento;
}