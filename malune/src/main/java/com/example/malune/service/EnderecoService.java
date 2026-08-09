package com.example.malune.service;

import com.example.malune.dto.EnderecoDTO;
import com.example.malune.entity.Endereco;
import com.example.malune.entity.Estado;
import com.example.malune.entity.Usuario;
import com.example.malune.repository.EnderecoRepository;
import com.example.malune.repository.EstadoRepository;
import com.example.malune.repository.UsuarioRepository;

import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
public class EnderecoService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;
    private final EstadoRepository estadoRepository;

    public Optional<Endereco> buscarEnderecoDoUsuario(Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        return Optional.ofNullable(usuario.getEndereco());
    }

    public Endereco salvarOuAtualizarEndereco(Integer idUsuario, EnderecoDTO dto) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        Estado estado = estadoRepository.findByEstado(dto.getEstado())
                .orElseThrow(() -> new RuntimeException("Estado inválido."));

        Endereco endereco = usuario.getEndereco();
        if (endereco == null) {
            endereco = new Endereco();
        }

        endereco.setCep(dto.getCep());
        endereco.setRua(dto.getRua());
        endereco.setBairro(dto.getBairro());
        endereco.setNumero(dto.getNumero());
        endereco.setComplemento(dto.getComplemento());
        endereco.setEstado(estado);

        endereco = enderecoRepository.save(endereco);

        if (usuario.getEndereco() == null) {
            usuario.setEndereco(endereco);
            usuarioRepository.save(usuario);
        }

        return endereco;
    }
}