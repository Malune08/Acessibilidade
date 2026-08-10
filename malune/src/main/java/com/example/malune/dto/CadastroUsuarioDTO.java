package com.example.malune.dto;

import com.example.malune.util.RegexPatterns;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CadastroUsuarioDTO {

    @NotBlank(message = "O nome completo é obrigatório.")
    private String nomeCompleto;

    @NotNull(message = "A data de nascimento é obrigatória.")
    @Past(message = "A data de nascimento deve ser uma data no passado.")
    private LocalDate dataNascimento;

    @NotBlank(message = "O CPF é obrigatório.")
    @Pattern(
            regexp = RegexPatterns.CPF,
            message = "CPF inválido. Informe o CPF com ou sem pontuação (ex: 12345678900 ou 123.456.789-00)."
    )
    private String cpf;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Pattern(
            regexp = RegexPatterns.EMAIL,
            message = "E-mail inválido."
    )
    private String email;

    @Pattern(
            regexp = RegexPatterns.TELEFONE,
            message = "Telefone inválido. Informe no formato (XX) 9XXXX-XXXX ou apenas números."
    )
    private String numeroTelefone;

    @NotBlank(message = "O nome de usuário é obrigatório.")
    @Pattern(
            regexp = RegexPatterns.NOME_USUARIO,
            message = "Nome de usuário inválido. Deve conter até 30 caracteres válidos."
    )
    private String nomeUsuario;

    @NotBlank(message = "A senha é obrigatória.")
    @Pattern(
            regexp = RegexPatterns.SENHA,
            message = "A senha deve conter entre 8 e 16 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
    )
    private String senha;
}