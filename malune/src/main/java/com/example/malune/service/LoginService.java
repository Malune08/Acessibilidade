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

    public LoginResponseDTO autenticar(LoginDTO loginDTO) {
        String identificador = loginDTO.getIdentificador().trim();

        Optional<Administrador> administrador = buscarAdministrador(identificador);
        if (administrador.isPresent()) {
            if (!administrador.get().getSenha().equals(loginDTO.getSenha())) {
                throw new IllegalArgumentException("E-mail/usuário ou senha inválidos.");
            }

            Administrador adm = administrador.get();
            return new LoginResponseDTO(
                    "ADMINISTRADOR",
                    adm.getId(),
                    adm.getNomeUsuario(),
                    adm.getEmail(),
                    adminAuthService.createToken(adm.getId())
            );
        }

        Optional<Usuario> usuario = buscarUsuario(identificador);
        if (usuario.isPresent() && usuario.get().getSenha().equals(loginDTO.getSenha())) {
            Usuario user = usuario.get();
            return new LoginResponseDTO(
                    "USUARIO",
                    user.getId(),
                    user.getNomeUsuario(),
                    user.getEmail(),
                    null
            );
        }

        throw new IllegalArgumentException("E-mail/usuário ou senha inválidos.");
    }

    private Optional<Administrador> buscarAdministrador(String identificador) {
        Optional<Administrador> porEmail = admRepository.findByEmailIgnoreCase(identificador);
        return porEmail.isPresent()
                ? porEmail
                : admRepository.findByNomeUsuarioIgnoreCase(identificador);
    }

    private Optional<Usuario> buscarUsuario(String identificador) {
        Optional<Usuario> porEmail = usuarioRepository.findByEmailIgnoreCase(identificador);
        return porEmail.isPresent()
                ? porEmail
                : usuarioRepository.findByNomeUsuarioIgnoreCase(identificador);
    }
}
