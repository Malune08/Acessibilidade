package com.example.malune.service;

import com.example.malune.entity.Pedido;
import com.example.malune.repository.ItemPedidoRepository;
import com.example.malune.repository.PedidoRepository;
import com.example.malune.repository.ProdutoRepository;
import com.example.malune.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Map<String, Object> getDashboardStats() {
        long totalProducts = produtoRepository.count();
        long totalOrders = pedidoRepository.count();
        long totalUsers = usuarioRepository.count();

        // Calculate total revenue
        BigDecimal revenue = pedidoRepository.findAll().stream()
                .map(Pedido::getValorTotal)
                .filter(v -> v != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Fetch recent orders (last 5)
        List<Map<String, Object>> recentOrders = pedidoRepository
                .findAll(PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "dataPedido")))
                .stream()
                .map(this::mapPedidoToMap)
                .collect(Collectors.toList());

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalProducts", totalProducts);
        dashboard.put("totalOrders", totalOrders);
        dashboard.put("totalUsers", totalUsers);
        dashboard.put("revenue", revenue);
        dashboard.put("recentOrders", recentOrders);

        return dashboard;
    }

    private Map<String, Object> mapPedidoToMap(Pedido p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("usuarioId", p.getUsuario() != null ? p.getUsuario().getId() : null);
        String nomeProduto = itemPedidoRepository.findByPedido(p).stream()
                .map(item -> item.getProduto().getNome())
                .filter(nome -> nome != null && !nome.isBlank())
                .findFirst()
                .orElse("Produto não informado");
        map.put("nomeProduto", nomeProduto);
        map.put("dataPedido", p.getDataPedido());
        map.put("valorTotal", p.getValorTotal());
        map.put("status", p.getStatus() != null ? p.getStatus().name() : null);
        return map;
    }
}

