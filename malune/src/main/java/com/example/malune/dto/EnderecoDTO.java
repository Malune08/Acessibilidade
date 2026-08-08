package com.example.malune.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnderecoDTO {
    
    @NotBlank(message = "O CEP é obrigatório.")
    private String cep;

    @NotBlank(message = "O estado é obrigatório.")
    private String estado;
    
    @NotBlank(message = "A rua é obrigatório.")
    private String rua;

    @NotBlank(message = "O bairro é obrigatório.")
    private String bairro;

    @NotNull(message = "O número é obrigatório.")
    private Integer numero;

    private String complemento;
}
