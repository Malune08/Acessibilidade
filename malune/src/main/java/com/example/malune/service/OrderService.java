package com.example.malune.service;

import com.example.malune.entity.Pedido;
import com.example.malune.entity.StatusPedido;
import com.example.malune.repository.PedidoRepository;
import com.example.malune.repository.StatusPedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private StatusPedidoRepository statusPedidoRepository;

    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    public Pedido findById(Long id) {
        return pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
    }

    public Pedido updateStatus(Long pedidoId, Long statusId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        StatusPedido status = statusPedidoRepository.findById(statusId)
                .orElseThrow(() -> new RuntimeException("Status não encontrado"));

        pedido.setStatus(status);
        return pedidoRepository.save(pedido);
    }

    public Pedido updateStatusByName(Long pedidoId, String statusName) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (statusName == null || statusName.isBlank()) {
            throw new IllegalArgumentException("Status é obrigatório");
        }

        StatusPedido status = statusPedidoRepository.findByStatusIgnoreCase(statusName.trim())
                .orElseThrow(() -> new RuntimeException("Status não encontrado: " + statusName));

        pedido.setStatus(status);
        return pedidoRepository.save(pedido);
    }

    public List<StatusPedido> getAllStatuses() {
        return statusPedidoRepository.findAll();
    }

    public List<Pedido> findPendingOrders() {
        StatusPedido pendingStatus = statusPedidoRepository.findByStatus("Pendente")
                .orElseThrow(() -> new RuntimeException("Status Pendente não encontrado"));
        return pedidoRepository.findByStatus(pendingStatus);
    }

    public boolean canTransitionStatus(String currentStatus, String newStatus) {
        // Simple state machine logic: define valid transitions
        // You can expand this based on your business rules
        return true; // For now, allow all transitions
    }
}

