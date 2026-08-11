package com.example.malune.dto;

import com.example.malune.entity.TipoCartao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartaoDTO {

    @NotBlank(message = "O número do cartão é obrigatório.")
    private String numero;

    @NotBlank(message = "O nome do titular é obrigatório.")
    private String nome;

    @NotBlank(message = "A validade é obrigatória.")
    private String validade;

    @NotBlank(message = "O CVV é obrigatório.")
    private String cvv;

    @NotNull(message = "O tipo do cartão é obrigatório.")
    private TipoCartao tipo;

}