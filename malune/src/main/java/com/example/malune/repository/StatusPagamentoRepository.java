package com.example.malune.repository;

import com.example.malune.entity.StatusPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatusPagamentoRepository extends JpaRepository<StatusPagamento, Long> {

    Optional<StatusPagamento> findByStatus(String status);
}
