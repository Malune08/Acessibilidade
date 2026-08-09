package com.example.malune.repository;

import com.example.malune.entity.ItemPedido;
import com.example.malune.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Integer> {

    List<ItemPedido> findByPedido(Pedido pedido);
}
