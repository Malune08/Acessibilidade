package com.example.malune.repository;

import com.example.malune.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {

    Optional<Token> findByTokenAndUsuarioId(
            String token,
            Integer idUsuario
    );
}