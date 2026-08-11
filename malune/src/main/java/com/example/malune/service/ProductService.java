package com.example.malune.service;

import com.example.malune.entity.Categoria;
import com.example.malune.entity.Produto;
import com.example.malune.repository.CategoriaRepository;
import com.example.malune.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Produto> findAll() {
        return produtoRepository.findAll();
    }

    public Optional<Produto> findById(Long id) {
        return produtoRepository.findById(id);
    }

    public Produto create(String nome, String descricao, BigDecimal valorUnitario, 
                         Integer categoriaId, Integer qtdEstoque) {
        validateProduct(nome, descricao, valorUnitario, qtdEstoque);

        Produto produto = new Produto();
        produto.setNome(nome.trim());
        produto.setDescricao(descricao.trim());
        produto.setValorUnitario(valorUnitario);
        
        if (categoriaId != null) {
            produto.setCategoria(findCategory(categoriaId));
        }
        
        produto.setQtdEstoque(qtdEstoque);
        return produtoRepository.save(produto);
    }

    public Produto update(Long id, String nome, String descricao, BigDecimal valorUnitario,
                         Integer categoriaId, Integer qtdEstoque) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (nome != null && nome.isBlank()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório");
        }
        if (descricao != null && descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição do produto é obrigatória");
        }
        if (valorUnitario != null && valorUnitario.signum() < 0) {
            throw new IllegalArgumentException("Valor do produto não pode ser negativo");
        }
        if (qtdEstoque != null && qtdEstoque < 0) {
            throw new IllegalArgumentException("Estoque não pode ser negativo");
        }

        if (nome != null) produto.setNome(nome.trim());
        if (descricao != null) produto.setDescricao(descricao.trim());
        if (valorUnitario != null) produto.setValorUnitario(valorUnitario);
        if (categoriaId != null) {
            produto.setCategoria(findCategory(categoriaId));
        }
        if (qtdEstoque != null) produto.setQtdEstoque(qtdEstoque);

        return produtoRepository.save(produto);
    }

    public void delete(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado");
        }
        produtoRepository.deleteById(id);
    }

    public List<Produto> findByNome(String nome) {
        return produtoRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Produto> findByCategoria(Integer categoriaId) {
        Categoria categoria = findCategory(categoriaId);
        return produtoRepository.findByCategoria(categoria);
    }

    private Categoria findCategory(Integer categoriaId) {
        return categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
    }

    private void validateProduct(String nome, String descricao, BigDecimal valorUnitario, Integer qtdEstoque) {
        if (nome == null || nome.isBlank()) {
            throw new IllegalArgumentException("Nome do produto é obrigatório");
        }
        if (descricao == null || descricao.isBlank()) {
            throw new IllegalArgumentException("Descrição do produto é obrigatória");
        }
        if (valorUnitario == null || valorUnitario.signum() < 0) {
            throw new IllegalArgumentException("Valor do produto é obrigatório e não pode ser negativo");
        }
        if (qtdEstoque == null || qtdEstoque < 0) {
            throw new IllegalArgumentException("Estoque deve ser maior ou igual a zero");
        }
    }
}

