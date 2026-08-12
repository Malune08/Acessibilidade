package com.example.malune.service;

import com.example.malune.dto.NovaSenhaDTO;
import com.example.malune.dto.ValidarTokenDTO;
import com.example.malune.entity.Token;
import com.example.malune.entity.Usuario;
import com.example.malune.repository.TokenRepository;
import com.example.malune.repository.UsuarioRepository;
import com.example.malune.util.Email;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class RecuperacaoSenhaService {

    private final UsuarioRepository usuarioRepository;
    private final TokenRepository tokenRepository;
    private final Email emailUtil;

    public RecuperacaoSenhaService(
            UsuarioRepository usuarioRepository,
            TokenRepository tokenRepository,
            Email emailUtil
    ) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.emailUtil = emailUtil;
    }

    private String gerarToken() {
        SecureRandom random = new SecureRandom();

        int numero = 100000 + random.nextInt(900000);

        return String.valueOf(numero);
    }

    public void solicitarRecuperacao(String email) {

        Usuario usuario = usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("E-mail não encontrado.")
                );

        String codigo = gerarToken();

        Token token = new Token();

        token.setUsuario(usuario);
        token.setToken(codigo);
        token.setDataCriacao(LocalDateTime.now());
        token.setDataExpiracao(
                LocalDateTime.now().plusHours(2)
        );
        token.setUtilizado(false);

        tokenRepository.save(token);

        emailUtil.enviarTokenRecuperacao(
                usuario.getEmail(),
                codigo
        );
    }

    public void validarToken(ValidarTokenDTO dto) {

        Usuario usuario = usuarioRepository
                .findByEmail(dto.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException("Usuário não encontrado.")
                );

        Token token = tokenRepository
                .findByTokenAndUsuarioId(
                        dto.getToken(),
                        usuario.getId()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException("Código inválido.")
                );

        if (token.getUtilizado()) {
            throw new IllegalArgumentException("Esse código já foi utilizado.");
        }

        if (LocalDateTime.now()
                .isAfter(token.getDataExpiracao())) {

            throw new IllegalArgumentException(
                    "Esse código expirou."
            );
        }
    }

    @Transactional
    public void alterarSenha(NovaSenhaDTO dto) {

        if (!dto.getNovaSenha()
                .equals(dto.getConfirmarSenha())) {

            throw new IllegalArgumentException(
                    "As senhas não coincidem."
            );
        }

        Usuario usuario = usuarioRepository
                .findByEmail(dto.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException("Usuário não encontrado.")
                );

        Token token = tokenRepository
                .findByTokenAndUsuarioId(
                        dto.getToken(),
                        usuario.getId()
                )
                .orElseThrow(() ->
                        new IllegalArgumentException("Código inválido.")
                );

        if (token.getUtilizado()) {
            throw new IllegalArgumentException("Esse código já foi utilizado.");
        }

        if (LocalDateTime.now()
                .isAfter(token.getDataExpiracao())) {

            throw new IllegalArgumentException("Esse código expirou.");
        }

        usuario.setSenha(dto.getNovaSenha());

        usuarioRepository.save(usuario);

        token.setUtilizado(true);

        tokenRepository.save(token);
    }
}