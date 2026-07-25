package com.example.malune.repository;

import com.example.malune.entity.Categoria;
import com.example.malune.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByCategoria(Categoria categoria);

    List<Produto> findByNomeContainingIgnoreCase(String nome);

    List<Produto> findByQtdEstoqueGreaterThan(Integer quantidade);
}
