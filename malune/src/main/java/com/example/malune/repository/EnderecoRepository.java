package com.example.malune.repository;

import com.example.malune.entity.Endereco;
import com.example.malune.entity.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

    List<Endereco> findByEstado(Estado estado);

    List<Endereco> findByCep(String cep);
}
