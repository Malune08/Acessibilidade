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
    private final AdminAuthService adminAuthService;

    public LoginService(
            UsuarioRepository usuarioRepository,
            AdmRepository admRepository,
            AdminAuthService adminAuthService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.admRepository = admRepository;
        this.adminAuthService = adminAuthService;
    }

    public LoginResponseDTO identificarLogin(LoginDTO loginDTO) {

        String identificador = loginDTO.getIdentificador();

        Optional<Usuario> usuario = usuarioRepository.findByEmailIgnoreCase(identificador);
        if (usuario.isEmpty()) {
            usuario = usuarioRepository.findByNomeUsuarioIgnoreCase(identificador);
        }

        if (usuario.isPresent()
                && usuario.get().getSenha().equals(loginDTO.getSenha())) {

            return new LoginResponseDTO(
                    "USUARIO",
                    usuario.get().getId()
            );
        }

        Optional<Administrador> administrador = admRepository.findByEmailIgnoreCase(identificador);
        if (administrador.isEmpty()) {
            administrador = admRepository.findByNomeUsuarioIgnoreCase(identificador);
        }

        if (administrador.isPresent()
                && administrador.get().getSenha().equals(loginDTO.getSenha())) {

            String token = adminAuthService.createToken(administrador.get().getId());

            return new LoginResponseDTO(
                    "ADMINISTRADOR",
                    administrador.get().getId(),
                    token
            );
        }

        return new LoginResponseDTO("INVALIDO", null);
    }
}