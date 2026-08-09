package com.example.malune.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.malune.entity.Categoria;
import com.example.malune.entity.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

    List<Produto> findByCategoria(Categoria categoria);
    List<Produto> findByNomeContainingIgnoreCase(String nome);
    List<Produto> findByQtdEstoqueGreaterThan(Integer quantidade);
    List<Produto> findByValorUnitarioLessThanEqual(BigDecimal max);
    List<Produto> findByCategoriaAndValorUnitarioLessThanEqual(Categoria categoria, BigDecimal max);
}
