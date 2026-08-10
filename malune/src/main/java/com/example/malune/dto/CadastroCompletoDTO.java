package com.example.malune.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CadastroCompletoDTO {

    @NotNull(message = "Os dados do usuário são obrigatórios.")
    @Valid
    private CadastroUsuarioDTO usuario;

    // Só é obrigatório quando cadastrarEndereco = true (validado no service, não aqui)
    @Valid
    private EnderecoDTO endereco;

    private boolean cadastrarEndereco;
}