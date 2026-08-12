package com.example.malune.repository;

import com.example.malune.entity.Carrinho;
import com.example.malune.entity.ItemCarrinho;
import com.example.malune.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemCarrinhoRepository extends JpaRepository<ItemCarrinho, Integer> {

    List<ItemCarrinho> findByCarrinho(Carrinho carrinho);

    Optional<ItemCarrinho> findByCarrinhoAndProduto(Carrinho carrinho, Produto produto);
}
