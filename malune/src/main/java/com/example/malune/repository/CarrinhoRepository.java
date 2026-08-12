package com.example.malune.repository;

import com.example.malune.entity.Carrinho;
import com.example.malune.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarrinhoRepository extends JpaRepository<Carrinho, Integer> {

    Optional<Carrinho> findByUsuario(Usuario usuario);
}
