package com.example.malune.dto;

import com.example.malune.util.RegexPatterns;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PerfilDTO {

    @NotBlank(message = "O nome completo é obrigatório.")
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Digite um e-mail válido.")
    private String email;

    @NotBlank(message = "O CPF é obrigatório.")
    @Pattern(regexp = RegexPatterns.CPF, message = "CPF inválido.")
    private String cpf;

    private String telefone;
}
