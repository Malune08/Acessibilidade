package com.example.malune.repository;

import com.example.malune.entity.Entrega;
import com.example.malune.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EntregaRepository extends JpaRepository<Entrega, Long> {

    Optional<Entrega> findByPedido(Pedido pedido);
}
