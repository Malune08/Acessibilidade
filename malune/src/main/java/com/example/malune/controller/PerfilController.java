package com.example.malune.controller;

import com.example.malune.dto.PerfilDTO;
import com.example.malune.dto.PerfilResponseDTO;
import com.example.malune.service.PerfilService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/perfil")
public class PerfilController {

    private final PerfilService perfilService;

    @GetMapping("/{idUsuario}")
    public ResponseEntity<PerfilResponseDTO> buscar(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(perfilService.buscarPerfil(idUsuario));
    }

    @PutMapping("/{idUsuario}")
    public ResponseEntity<PerfilResponseDTO> atualizar(
            @PathVariable Integer idUsuario,
            @Valid @RequestBody PerfilDTO dto
    ) {
        return ResponseEntity.ok(perfilService.atualizarPerfil(idUsuario, dto));
    }
}
