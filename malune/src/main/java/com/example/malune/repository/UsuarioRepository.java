package com.example.malune.repository;

import com.example.malune.entity.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByCpf(String cpf);

    Optional<Usuario> findByNomeUsuario(String nomeUsuario);

    boolean existsByEmail(String email);

    boolean existsByCpf(String cpf);

    boolean existsByNomeUsuario(String nomeUsuario);

}
