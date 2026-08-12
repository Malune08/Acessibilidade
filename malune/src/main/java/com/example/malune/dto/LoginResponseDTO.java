package com.example.malune.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponseDTO {

    private String tipo;
    private Integer id;
    private String token;

    public LoginResponseDTO(String tipo, Integer id) {
        this(tipo, id, null);
    }
}