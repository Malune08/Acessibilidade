package com.example.malune.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.malune.entity.Administrador;

@Repository
public interface AdmRepository extends JpaRepository<Administrador, Integer> {

    Optional<Administrador> findByEmail(String email);

    Optional<Administrador> findByNomeUsuario(String nomeUsuario);

    Optional<Administrador> findByEmailIgnoreCase(String email);

    Optional<Administrador> findByNomeUsuarioIgnoreCase(String nomeUsuario);

    boolean existsByEmail(String email);

    boolean existsByNomeUsuario(String nomeUsuario);
}
