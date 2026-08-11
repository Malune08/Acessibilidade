package com.example.malune.dto;

import com.example.malune.util.RegexPatterns;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnderecoDTO {

    @NotBlank(message = "CEP obrigatório.")
    @Pattern(
            regexp = RegexPatterns.CEP,
            message = "CEP inválido."
    )
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
