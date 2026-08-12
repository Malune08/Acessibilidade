package com.example.malune.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NovaSenhaDTO {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String token;

    @NotBlank
    @Size(min = 8)
    private String novaSenha;

    @NotBlank
    private String confirmarSenha;
}