package com.example.malune.repository;

import com.example.malune.entity.StatusPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatusPedidoRepository extends JpaRepository<StatusPedido, Long> {

    Optional<StatusPedido> findByStatus(String status);
}
