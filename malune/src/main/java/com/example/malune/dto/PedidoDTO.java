package com.example.malune.dto;

import com.example.malune.entity.FormaPagamento;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PedidoDTO {

    @NotEmpty(message = "O pedido precisa ter ao menos um item.")
    @Valid
    private List<ItemPedidoDTO> itens;

    @NotNull(message = "A forma de pagamento é obrigatória.")
    private FormaPagamento formaPagamento;

    private Integer cartaoId;

    @Valid
    private CartaoDTO cartaoNovo;

}