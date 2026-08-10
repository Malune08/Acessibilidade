package com.example.malune.controller;

import com.example.malune.dto.CadastroCompletoDTO;
import com.example.malune.service.CadastroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/cadastro")
@RequiredArgsConstructor
public class CadastroController {

    private final CadastroService cadastroService;

    @PostMapping
    public String cadastrar(@Valid @RequestBody CadastroCompletoDTO dto) {
        cadastroService.cadastrar(dto);
        return "CADASTRO_CONCLUIDO";
    }
}