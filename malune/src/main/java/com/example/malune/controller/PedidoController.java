package com.example.malune.controller;

import com.example.malune.dto.PedidoDTO;
import com.example.malune.dto.PedidoResponseDTO;
import com.example.malune.dto.PedidoResumoDTO;
import com.example.malune.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping("/{idUsuario}")
    public ResponseEntity<List<PedidoResumoDTO>> listar(@PathVariable Integer idUsuario) {
        return ResponseEntity.ok(pedidoService.listarPedidosDoUsuario(idUsuario));
    }

    @PostMapping("/{idUsuario}")
    public ResponseEntity<PedidoResponseDTO> confirmar(@PathVariable Integer idUsuario, @Valid @RequestBody PedidoDTO dto) {
        PedidoResponseDTO resposta = pedidoService.confirmarPedido(idUsuario, dto);
        return ResponseEntity.ok(resposta);
    }
}
