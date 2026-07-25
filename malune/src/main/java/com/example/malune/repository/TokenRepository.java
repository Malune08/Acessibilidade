package com.example.malune.repository;

import com.example.malune.entity.Token;
import com.example.malune.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    Optional<Token> findByToken(String token);

    List<Token> findByUsuario(Usuario usuario);

    List<Token> findByUsuarioAndUtilizadoFalse(Usuario usuario);
}
