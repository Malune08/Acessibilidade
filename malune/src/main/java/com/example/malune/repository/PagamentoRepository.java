package com.example.malune.repository;

import com.example.malune.entity.Pagamento;
import com.example.malune.entity.Pedido;
import com.example.malune.entity.StatusPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Integer> {

    List<Pagamento> findByPedido(Pedido pedido);

    List<Pagamento> findByStatus(StatusPagamento status);
}
