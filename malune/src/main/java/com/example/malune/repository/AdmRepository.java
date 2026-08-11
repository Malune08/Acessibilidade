package com.example.malune.repository;

import com.example.malune.entity.Adm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdmRepository extends JpaRepository<Adm, Long> {

    Optional<Adm> findByEmail(String email);

    Optional<Adm> findByEmailIgnoreCase(String email);

    Optional<Adm> findByNomeUsuario(String nomeUsuario);

    Optional<Adm> findByNomeUsuarioIgnoreCase(String nomeUsuario);

    boolean existsByEmail(String email);

    boolean existsByNomeUsuario(String nomeUsuario);
}
