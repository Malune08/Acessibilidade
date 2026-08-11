package com.example.malune.service;

import com.example.malune.entity.Produto;
import com.example.malune.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StockService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Produto> listAllStocks() {
        return produtoRepository.findAll();
    }

    public Produto getStockById(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    public Produto updateStock(Long id, Integer novaQuantidade) {
        if (novaQuantidade == null || novaQuantidade < 0) {
            throw new IllegalArgumentException("Quantidade de estoque inválida");
        }

        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        produto.setQtdEstoque(novaQuantidade);
        return produtoRepository.save(produto);
    }

    public Produto incrementStock(Long id, Integer quantidade) {
        if (quantidade == null || quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser positiva");
        }

        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        int novaQuantidade = (produto.getQtdEstoque() == null ? 0 : produto.getQtdEstoque()) + quantidade;
        produto.setQtdEstoque(novaQuantidade);
        return produtoRepository.save(produto);
    }

    public Produto decrementStock(Long id, Integer quantidade) {
        if (quantidade == null || quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser positiva");
        }

        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        int novaQuantidade = (produto.getQtdEstoque() == null ? 0 : produto.getQtdEstoque()) - quantidade;
        if (novaQuantidade < 0) {
            throw new RuntimeException("Estoque insuficiente");
        }

        produto.setQtdEstoque(novaQuantidade);
        return produtoRepository.save(produto);
    }

    public List<Produto> findLowStock(Integer threshold) {
        if (threshold == null || threshold < 0) {
            throw new IllegalArgumentException("Limite de estoque inválido");
        }
        return produtoRepository.findByQtdEstoqueLessThanEqual(threshold);
    }
}

