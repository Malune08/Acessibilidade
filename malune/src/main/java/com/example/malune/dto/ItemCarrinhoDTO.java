package com.example.malune.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemCarrinhoDTO {

    @NotNull(message = "O produto é obrigatório.")
    private Integer idProduto;

    @NotNull(message = "A quantidade é obrigatória.")
    @Positive(message = "A quantidade deve ser maior que zero.")
    private Integer quantidade;
}
