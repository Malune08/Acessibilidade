package com.example.malune.repository;

import com.example.malune.entity.Pedido;
import com.example.malune.entity.StatusPedido;
import com.example.malune.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByUsuario(Usuario usuario);

    List<Pedido> findByStatus(StatusPedido status);

    List<Pedido> findByUsuarioOrderByDataPedidoDesc(Usuario usuario);
}
