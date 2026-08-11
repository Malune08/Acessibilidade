package com.example.malune.controller;

import com.example.malune.entity.Produto;
import com.example.malune.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/api/stock")
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping
    public List<Map<String, Object>> listStocks() {
        return stockService.listAllStocks().stream()
                .map(this::toStockMap)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStockById(@PathVariable Long id) {
        try {
            Produto produto = stockService.getStockById(id);
            return ResponseEntity.ok(toStockMap(produto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            Integer qtdEstoque = body.get("qtdEstoque") != null 
                    ? Integer.valueOf(String.valueOf(body.get("qtdEstoque"))) 
                    : null;
            
            Produto produto = stockService.updateStock(id, qtdEstoque);
            return ResponseEntity.ok(Map.of("id", produto.getId(), "qtdEstoque", produto.getQtdEstoque()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/increment")
    public ResponseEntity<?> incrementStock(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            Integer quantidade = body.get("quantidade") != null 
                    ? Integer.valueOf(String.valueOf(body.get("quantidade"))) 
                    : null;
            
            Produto produto = stockService.incrementStock(id, quantidade);
            return ResponseEntity.ok(Map.of("id", produto.getId(), "qtdEstoque", produto.getQtdEstoque()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/decrement")
    public ResponseEntity<?> decrementStock(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            Integer quantidade = body.get("quantidade") != null 
                    ? Integer.valueOf(String.valueOf(body.get("quantidade"))) 
                    : null;
            
            Produto produto = stockService.decrementStock(id, quantidade);
            return ResponseEntity.ok(Map.of("id", produto.getId(), "qtdEstoque", produto.getQtdEstoque()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    private Map<String, Object> toStockMap(Produto produto) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", produto.getId());
        result.put("nome", produto.getNome());
        result.put("qtdEstoque", produto.getQtdEstoque());
        return result;
    }
}

