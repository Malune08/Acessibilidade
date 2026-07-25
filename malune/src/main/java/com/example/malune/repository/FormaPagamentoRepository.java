package com.example.malune.repository;

import com.example.malune.entity.FormaPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FormaPagamentoRepository extends JpaRepository<FormaPagamento, Long> {

    Optional<FormaPagamento> findByForma(String forma);
}
