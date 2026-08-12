package com.example.malune.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidarTokenDTO {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String token;
}