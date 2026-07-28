package com.example.malune.repository;

import com.example.malune.entity.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdmRepository extends JpaRepository<Administrador, Long> {

    Optional<Administrador> findByEmail(String email);

    Optional<Administrador> findByNomeUsuario(String nomeUsuario);

    boolean existsByEmail(String email);

    boolean existsByNomeUsuario(String nomeUsuario);
}
