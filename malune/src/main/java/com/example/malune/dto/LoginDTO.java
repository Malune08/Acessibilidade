package com.example.malune.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
public class LoginDTO {

    @NotBlank(message = "Informe o e-mail ou nome de usuário.")
    private String identificador;

    @NotBlank(message = "A senha é obrigatória.")
    private String senha;
}