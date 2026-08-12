package com.example.malune.controller;

import com.example.malune.dto.*;
import com.example.malune.service.RecuperacaoSenhaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recuperacao-senha")
public class RecuperacaoSenhaController {

    private final RecuperacaoSenhaService service;

    public RecuperacaoSenhaController(
            RecuperacaoSenhaService service
    ) {
        this.service = service;
    }

    @PostMapping("/solicitar")
    public ResponseEntity<String> solicitar(
            @Valid @RequestBody SolicitarRecuperacaoDTO dto
    ) {

        service.solicitarRecuperacao(dto.getEmail());

        return ResponseEntity.ok(
                "Código enviado para o e-mail."
        );
    }

    @PostMapping("/validar")
    public ResponseEntity<String> validar(
            @Valid @RequestBody ValidarTokenDTO dto
    ) {

        service.validarToken(dto);

        return ResponseEntity.ok(
                "Código válido."
        );
    }

    @PostMapping("/alterar")
    public ResponseEntity<String> alterar(
            @Valid @RequestBody NovaSenhaDTO dto
    ) {

        service.alterarSenha(dto);

        return ResponseEntity.ok(
                "Senha alterada com sucesso."
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(
            IllegalArgumentException e
    ) {
        return ResponseEntity
                .badRequest()
                .body(e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationException(
            MethodArgumentNotValidException e
    ) {
        String mensagem = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Dados inválidos.");

        return ResponseEntity
                .badRequest()
                .body(mensagem);
    }
}