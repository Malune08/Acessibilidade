package com.example.malune.service;

import com.example.malune.dto.LoginDTO;
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

    public LoginService(UsuarioRepository usuarioRepository, AdmRepository admRepository) {
        this.usuarioRepository = usuarioRepository;
        this.admRepository = admRepository;
    }

    public String identificarLogin(LoginDTO loginDTO) {

        if (loginUsuario(loginDTO)) {
            return "USUARIO";
        }

        if (loginAdm(loginDTO)) {
            return "ADMINISTRADOR";
        }

        return "INVALIDO";
    }

    public boolean loginUsuario(LoginDTO loginDTO) {

        Optional<Usuario> usuario = usuarioRepository.findByEmail(loginDTO.getEmail());

        if (usuario.isEmpty()) {
            return false;
        }

        return usuario.get().getSenha().equals(loginDTO.getSenha());
    }

    public boolean loginAdm(LoginDTO loginDTO) {

        Optional<Administrador> administrador = admRepository.findByEmail(loginDTO.getEmail());

        if (administrador.isEmpty()) {
            return false;
        }

        return administrador.get().getSenha().equals(loginDTO.getSenha());
    }
}