package com.example.malune.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PerfilResponseDTO {

    private Integer id;
    private String nome;
    private String email;
    private String cpf;
    private String telefone;
}
