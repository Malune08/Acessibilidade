package com.example.malune.service;

import com.example.malune.entity.Pedido;
import com.example.malune.entity.StatusPedido;
import com.example.malune.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class OrderService {

    private final PedidoRepository pedidoRepository;

    public OrderService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    public Pedido findById(Integer id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
    }

    public Pedido updateStatus(Integer pedidoId, String statusName) {
        Pedido pedido = findById(pedidoId);
        StatusPedido novoStatus = parseStatus(statusName);
        StatusPedido statusAtual = pedido.getStatus();

        if (!canTransitionStatus(statusAtual, novoStatus)) {
            throw new IllegalArgumentException("Transição de status inválida");
        }

        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }

    public List<StatusPedido> getAllStatuses() {
        return Arrays.asList(StatusPedido.values());
    }

    public List<Pedido> findPendingOrders() {
        return pedidoRepository.findByStatus(StatusPedido.AGUARDANDO);
    }

    private StatusPedido parseStatus(String statusName) {
        if (statusName == null || statusName.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório");
        }

        try {
            return StatusPedido.valueOf(statusName.trim().toUpperCase());
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Status não encontrado: " + statusName);
        }
    }

    private boolean canTransitionStatus(StatusPedido currentStatus, StatusPedido newStatus) {
        if (currentStatus == null || currentStatus == newStatus) {
            return currentStatus == newStatus;
        }

        return switch (currentStatus) {
            case AGUARDANDO -> newStatus == StatusPedido.CONFIRMADO || newStatus == StatusPedido.CANCELADO;
            case CONFIRMADO -> newStatus == StatusPedido.ENVIADO || newStatus == StatusPedido.CANCELADO;
            case ENVIADO -> newStatus == StatusPedido.ENTREGUE;
            case ENTREGUE, CANCELADO -> false;
        };
    }
}
