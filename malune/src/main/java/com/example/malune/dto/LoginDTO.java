package com.example.malune.dto;


import com.example.malune.util.RegexPatterns;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
public class LoginDTO {

    @NotBlank(message = "O email é obrigatório.")
    @Email(message = "Digite um email válido.")
    private String email;

    @NotBlank(message = "A senha é obrigatória.")
    @Pattern(
            regexp = RegexPatterns.SENHA,
            message = "A senha deve conter entre 8 e 16 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
    )
    private String senha;
}