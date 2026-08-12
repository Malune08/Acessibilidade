package com.example.malune.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class ItemCarrinhoResponseDTO {

    private Integer idProduto;
    private String nome;
    private String descricao;
    private String imagem;
    private BigDecimal valorUnitario;
    private Integer quantidade;
    private BigDecimal subtotal;
}
