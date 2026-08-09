package com.example.malune.controller;

import com.example.malune.dto.CartaoResponseDTO;
import com.example.malune.service.CartaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cartao")
public class CartaoController {

    private final CartaoService cartaoService;

    public CartaoController(CartaoService cartaoService) {
        this.cartaoService = cartaoService;
    }

    @GetMapping("/{idUsuario}")
    public List<CartaoResponseDTO> listar(@PathVariable Integer idUsuario) {
        return cartaoService.listarCartoesDoUsuario(idUsuario);
    }
}