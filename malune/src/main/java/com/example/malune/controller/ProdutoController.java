package com.example.malune.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.malune.entity.Produto;
import com.example.malune.service.ProdutoService;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public List<Produto> listarProdutos() {
        return produtoService.listarProdutos();
    }

    @GetMapping("/{id}")
    public Produto buscarPorId(@PathVariable Integer id) {
        return produtoService.buscarPorId(id);
    }

    @GetMapping("/buscar")
    public List<Produto> buscarPorNome(@RequestParam String nome) {
        return produtoService.buscarPorNome(nome);
    }

    @PostMapping
    public Produto criar(@RequestBody Produto produto) {
        return produtoService.salvar(produto);
    }

    // @DeleteMapping("/{id}")
    // public void deletar(@PathVariable Integer id) {
    //     produtoService.deletar(id);
    // }
    // @GetMapping("/preco")
    // public List<Produto> buscarPorPrecoMaximo(@RequestParam BigDecimal max) {
    //     return produtoService.buscarPorPrecoMaximo(max);
    // }
    @GetMapping("/filtro")
    public List<Produto> filtrarProdutos(
            @RequestParam(required = false) Integer categoria,
            @RequestParam(required = false) BigDecimal precoMax) {
        return produtoService.filtrarProdutos(categoria, precoMax);
    }
}