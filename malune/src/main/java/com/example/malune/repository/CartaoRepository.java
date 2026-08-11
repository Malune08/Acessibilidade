package com.example.malune.repository;

import com.example.malune.entity.Cartao;
import com.example.malune.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartaoRepository extends JpaRepository<Cartao, Integer> {

    List<Cartao> findByUsuario(Usuario usuario);

    Optional<Cartao> findByNumeroCartao(String numeroCartao);

    boolean existsByNumeroCartao(String numeroCartao);
}
