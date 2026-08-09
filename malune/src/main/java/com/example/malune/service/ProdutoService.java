package com.example.malune.service;

import java.math.BigDecimal;
import java.util.List;

import org.hibernate.internal.find.FindByKeyOperation;
import org.springframework.stereotype.Service;

import com.example.malune.entity.Categoria;
import com.example.malune.entity.Produto;
import com.example.malune.repository.CategoriaRepository;
import com.example.malune.repository.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoService(ProdutoRepository produtoRepository, CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    public Produto buscarPorId(Integer id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    public List<Produto> buscarPorNome(String nome) {
        return produtoRepository.findByNomeContainingIgnoreCase(nome);
    }

    public Produto salvar(Produto produto) {
        return produtoRepository.save(produto);
    }

    public void deletar(Integer id) {
        produtoRepository.deleteById(id);
    }
    public List<Produto> buscarPorPrecoMaximo(BigDecimal max) {
    return produtoRepository.findByValorUnitarioLessThanEqual(max);
}
    public List<Produto> filtrarProdutos(Integer idCategoria, BigDecimal precoMax) {
    if (idCategoria != null && precoMax != null) {
        Categoria categoria = categoriaRepository.findById(idCategoria)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        return produtoRepository.findByCategoriaAndValorUnitarioLessThanEqual(categoria, precoMax);
    }

    if (idCategoria != null) {
        return categoriaRepository.findById(idCategoria)
                .map(produtoRepository::findByCategoria)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
    }

    if (precoMax != null) {
        return buscarPorPrecoMaximo(precoMax);
    }
    return listarProdutos();
}
}