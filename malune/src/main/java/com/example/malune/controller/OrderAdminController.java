package com.example.malune.controller;

import com.example.malune.entity.Pedido;
import com.example.malune.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/api/orders")
public class OrderAdminController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Map<String, Object>> listOrders() {
        return orderService.findAll().stream()
                .map(this::mapPedidoToMap)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            Pedido pedido = orderService.findById(id);
            return ResponseEntity.ok(mapPedidoToMap(pedido));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/statuses")
    public List<Map<String, Object>> listStatuses() {
        return orderService.getAllStatuses().stream()
                .map(status -> {
                    Map<String, Object> result = new LinkedHashMap<>();
                    result.put("id", status.getId());
                    result.put("status", status.getStatus());
                    return result;
                })
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            Pedido pedido;

            if (body.containsKey("statusId")) {
                Long statusId = Long.valueOf(String.valueOf(body.get("statusId")));
                pedido = orderService.updateStatus(id, statusId);
            } else if (body.containsKey("status")) {
                String statusName = String.valueOf(body.get("status"));
                pedido = orderService.updateStatusByName(id, statusName);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "statusId or status is required"));
            }

            return ResponseEntity.ok(Map.of(
                    "id", pedido.getId(),
                    "status", pedido.getStatus() != null ? pedido.getStatus().getStatus() : null
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> mapPedidoToMap(Pedido p) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", p.getId());
        result.put("usuarioId", p.getUsuario() != null ? p.getUsuario().getId() : null);
        result.put("dataPedido", p.getDataPedido());
        result.put("valorTotal", p.getValorTotal());
        result.put("status", p.getStatus() != null ? p.getStatus().getStatus() : null);
        return result;
    }
}

