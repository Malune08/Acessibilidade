package com.example.malune.controller;

import com.example.malune.dto.EnderecoDTO;
import com.example.malune.entity.Endereco;
import com.example.malune.service.EnderecoService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/endereco")
public class EnderecoController {

    private final EnderecoService enderecoService;
    
    @GetMapping("/{idUsuario}")
    public ResponseEntity<Endereco> buscar(@PathVariable Integer idUsuario) {
        Optional<Endereco> endereco = enderecoService.buscarEnderecoDoUsuario(idUsuario);

        return endereco.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PutMapping("/{idUsuario}")
    public ResponseEntity<Endereco> salvar(@PathVariable Integer idUsuario,
                                            @Valid @RequestBody EnderecoDTO dto) {
        Endereco endereco = enderecoService.salvarOuAtualizarEndereco(idUsuario, dto);
        return ResponseEntity.ok(endereco);
    }
}