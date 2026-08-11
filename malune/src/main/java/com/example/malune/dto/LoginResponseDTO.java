package com.example.malune.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponseDTO {

    private String tipo;
    private Integer id;
    private String nomeUsuario;
    private String email;
    private String token;
}
