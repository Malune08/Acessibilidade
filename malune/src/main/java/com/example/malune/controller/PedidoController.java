package com.example.malune.controller;

import com.example.malune.dto.PedidoDTO;
import com.example.malune.dto.PedidoResponseDTO;
import com.example.malune.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping("/{idUsuario}")
    public ResponseEntity<PedidoResponseDTO> confirmar(@PathVariable Integer idUsuario, @Valid @RequestBody PedidoDTO dto) {
        PedidoResponseDTO resposta = pedidoService.confirmarPedido(idUsuario, dto);
        return ResponseEntity.ok(resposta);
    }
}