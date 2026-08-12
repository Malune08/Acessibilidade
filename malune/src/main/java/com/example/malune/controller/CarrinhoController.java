package com.example.malune.controller;

import com.example.malune.dto.CarrinhoResponseDTO;
import com.example.malune.dto.ItemCarrinhoDTO;
import com.example.malune.service.CarrinhoService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/carrinho")
public class CarrinhoController {

    private final CarrinhoService carrinhoService;

    @GetMapping("/{idUsuario}")
    public ResponseEntity<CarrinhoResponseDTO> buscar(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(carrinhoService.buscarCarrinho(idUsuario));
    }

    @PostMapping("/{idUsuario}/itens")
    public ResponseEntity<CarrinhoResponseDTO> adicionar(
            @PathVariable Integer idUsuario,
            @Valid @RequestBody ItemCarrinhoDTO dto
    ) {
        return ResponseEntity.ok(carrinhoService.adicionarItem(idUsuario, dto));
    }

    @PutMapping("/{idUsuario}/itens/{idProduto}")
    public ResponseEntity<CarrinhoResponseDTO> atualizarQuantidade(
            @PathVariable Integer idUsuario,
            @PathVariable Integer idProduto,
            @Valid @RequestBody ItemCarrinhoDTO dto
    ) {
        return ResponseEntity.ok(carrinhoService.atualizarQuantidade(idUsuario, idProduto, dto));
    }

    @DeleteMapping("/{idUsuario}/itens/{idProduto}")
    public ResponseEntity<Void> remover(@PathVariable Integer idUsuario, @PathVariable Integer idProduto) {
        carrinhoService.removerItem(idUsuario, idProduto);
        return ResponseEntity.noContent().build();
    }
}
