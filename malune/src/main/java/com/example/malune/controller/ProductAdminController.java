package com.example.malune.controller;

import com.example.malune.entity.Produto;
import com.example.malune.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/api/products")
public class ProductAdminController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Produto> listAll() {
        return productService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Produto produto = productService.findById(id)
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
            return ResponseEntity.ok(produto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        try {
            String nome = (String) body.get("nome");
            String descricao = (String) body.get("descricao");
            BigDecimal valorUnitario = body.get("valorUnitario") != null 
                    ? new BigDecimal(String.valueOf(body.get("valorUnitario"))) 
                    : null;
            Integer categoriaId = body.get("categoriaId") != null 
                    ? Integer.valueOf(String.valueOf(body.get("categoriaId"))) 
                    : null;
            Integer qtdEstoque = body.get("qtdEstoque") != null 
                    ? Integer.valueOf(String.valueOf(body.get("qtdEstoque"))) 
                    : 0;

            Produto produto = productService.create(nome, descricao, valorUnitario, categoriaId, qtdEstoque);
            return ResponseEntity.status(HttpStatus.CREATED).body(produto);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            String nome = body.containsKey("nome") ? (String) body.get("nome") : null;
            String descricao = body.containsKey("descricao") ? (String) body.get("descricao") : null;
            BigDecimal valorUnitario = body.containsKey("valorUnitario") 
                    ? new BigDecimal(String.valueOf(body.get("valorUnitario"))) 
                    : null;
            Integer categoriaId = body.containsKey("categoriaId") 
                    ? Integer.valueOf(String.valueOf(body.get("categoriaId"))) 
                    : null;
            Integer qtdEstoque = body.containsKey("qtdEstoque") 
                    ? Integer.valueOf(String.valueOf(body.get("qtdEstoque"))) 
                    : null;

            Produto produto = productService.update(id, nome, descricao, valorUnitario, categoriaId, qtdEstoque);
            return ResponseEntity.ok(produto);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", ex.getMessage()));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            productService.delete(id);
            return ResponseEntity.ok(Map.of("deleted", true));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
        }
    }
}

