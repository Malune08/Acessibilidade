package com.example.malune.dto;

import com.example.malune.entity.TipoCartao;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class CartaoResponseDTO {
    private Integer id;
    private String nome;
    private String numeroCartao;
    private TipoCartao tipoCartao;
    private LocalDate dataValidade;
}