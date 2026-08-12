package com.example.malune.service;

import com.example.malune.dto.PerfilDTO;
import com.example.malune.dto.PerfilResponseDTO;
import com.example.malune.entity.Usuario;
import com.example.malune.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@AllArgsConstructor
@Service
public class PerfilService {

    private final UsuarioRepository usuarioRepository;

    public PerfilResponseDTO buscarPerfil(Integer idUsuario) {
        return paraResposta(buscarUsuario(idUsuario));
    }

    public PerfilResponseDTO atualizarPerfil(Integer idUsuario, PerfilDTO dto) {
        Usuario usuario = buscarUsuario(idUsuario);
        validarEmailDisponivel(dto.getEmail().trim(), idUsuario);
        validarCpfDisponivel(dto.getCpf().trim(), idUsuario);

        usuario.setNomeCompleto(dto.getNome().trim());
        usuario.setEmail(dto.getEmail().trim());
        usuario.setCpf(dto.getCpf().trim());
        usuario.setNumeroTelefone(normalizarTelefone(dto.getTelefone()));

        return paraResposta(usuarioRepository.save(usuario));
    }

    private Usuario buscarUsuario(Integer idUsuario) {
        return usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));
    }

    private void validarEmailDisponivel(String email, Integer idUsuario) {
        usuarioRepository.findByEmailIgnoreCase(email)
                .filter(usuario -> !usuario.getId().equals(idUsuario))
                .ifPresent(usuario -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Este e-mail já está em uso.");
                });
    }

    private void validarCpfDisponivel(String cpf, Integer idUsuario) {
        usuarioRepository.findByCpf(cpf)
                .filter(usuario -> !usuario.getId().equals(idUsuario))
                .ifPresent(usuario -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Este CPF já está em uso.");
                });
    }

    private String normalizarTelefone(String telefone) {
        return telefone == null || telefone.isBlank() ? null : telefone.trim();
    }

    private PerfilResponseDTO paraResposta(Usuario usuario) {
        return new PerfilResponseDTO(
                usuario.getId(),
                usuario.getNomeCompleto(),
                usuario.getEmail(),
                usuario.getCpf(),
                usuario.getNumeroTelefone()
        );
    }
}
