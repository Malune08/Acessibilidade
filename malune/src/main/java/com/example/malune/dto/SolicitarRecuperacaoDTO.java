package com.example.malune.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SolicitarRecuperacaoDTO {

    @NotBlank
    @Email
    private String email;
}