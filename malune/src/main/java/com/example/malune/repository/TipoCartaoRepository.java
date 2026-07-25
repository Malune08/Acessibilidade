package com.example.malune.repository;

import com.example.malune.entity.TipoCartao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TipoCartaoRepository extends JpaRepository<TipoCartao, Long> {

    Optional<TipoCartao> findByCategoria(String categoria);
}
