package com.example.malune.dto;


import com.example.malune.util.RegexPatterns;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
public class LoginDTO {

    @NotBlank(message = "O e-mail ou usuário é obrigatório.")
    private String identificador;

    @NotBlank(message = "A senha é obrigatória.")
    @Pattern(
            regexp = RegexPatterns.SENHA,
            message = "A senha deve conter entre 8 e 16 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
    )
    private String senha;
}
