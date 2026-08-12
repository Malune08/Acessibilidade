package com.example.malune.service;

import com.example.malune.dto.LoginDTO;
import com.example.malune.dto.LoginResponseDTO;
import com.example.malune.entity.Administrador;
import com.example.malune.entity.Usuario;
import com.example.malune.repository.AdmRepository;
import com.example.malune.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {

    private final UsuarioRepository usuarioRepository;
    private final AdmRepository admRepository;

    public LoginService(
            UsuarioRepository usuarioRepository,
            AdmRepository admRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.admRepository = admRepository;
    }

    public LoginResponseDTO identificarLogin(LoginDTO loginDTO) {

        Optional<Usuario> usuario = usuarioRepository.findByEmail(loginDTO.getEmail());

        if (usuario.isPresent()
                && usuario.get().getSenha().equals(loginDTO.getSenha())) {

            return new LoginResponseDTO(
                    "USUARIO",
                    usuario.get().getId()
            );
        }

        Optional<Administrador> administrador = admRepository.findByEmail(loginDTO.getEmail());

        if (administrador.isPresent()
                && administrador.get().getSenha().equals(loginDTO.getSenha())) {

            return new LoginResponseDTO(
                    "ADMINISTRADOR",
                    administrador.get().getId()
            );
        }

        return new LoginResponseDTO("INVALIDO", null);
    }
}