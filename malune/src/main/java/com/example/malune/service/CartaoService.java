package com.example.malune.service;

import com.example.malune.dto.CartaoResponseDTO;
import com.example.malune.entity.Usuario;
import com.example.malune.repository.CartaoRepository;
import com.example.malune.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class CartaoService {

    private final UsuarioRepository usuarioRepository;
    private final CartaoRepository cartaoRepository;

    public List<CartaoResponseDTO> listarCartoesDoUsuario(Integer idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        return cartaoRepository.findByUsuario(usuario).stream()
                .map(cartao -> new CartaoResponseDTO(
                        cartao.getId(),
                        cartao.getNome(),
                        cartao.getNumeroCartao(),
                        cartao.getTipoCartao(),
                        cartao.getDataValidade()
                ))
                .toList();
    }
}