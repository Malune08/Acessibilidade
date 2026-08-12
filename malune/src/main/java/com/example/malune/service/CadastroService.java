package com.example.malune.service;

import com.example.malune.dto.CadastroCompletoDTO;
import com.example.malune.dto.CadastroUsuarioDTO;
import com.example.malune.dto.EnderecoDTO;
import com.example.malune.entity.Endereco;
import com.example.malune.entity.Estado;
import com.example.malune.entity.Usuario;
import com.example.malune.repository.EnderecoRepository;
import com.example.malune.repository.EstadoRepository;
import com.example.malune.repository.UsuarioRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CadastroService {

    private final UsuarioRepository usuarioRepository;
    private final EnderecoRepository enderecoRepository;
    private final EstadoRepository estadoRepository;

    @Transactional
    public Usuario cadastrar(CadastroCompletoDTO dto) {

        Usuario usuario = validaCadastroUsuario(dto.getUsuario());

        if (dto.isCadastrarEndereco()) {

            if (dto.getEndereco() == null) {
                throw new IllegalArgumentException("Endereço não informado.");
            }

            Endereco endereco = validaCadastroEndereco(dto.getEndereco());

            usuario.setEndereco(endereco);
        }

        return usuarioRepository.save(usuario);
    }


    // USUÁRIO
    public Usuario validaCadastroUsuario(CadastroUsuarioDTO dto) {

        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }

        if (usuarioRepository.existsByCpf(dto.getCpf())) {
            throw new IllegalArgumentException("CPF já cadastrado.");
        }

        if (usuarioRepository.existsByNomeUsuario(dto.getNomeUsuario())) {
            throw new IllegalArgumentException("Nome de usuário já cadastrado.");
        }

        if (dto.getDataNascimento() == null) {
            throw new IllegalArgumentException("A data de nascimento é obrigatória.");
        }

        LocalDate dataLimite = LocalDate.now().minusYears(16);
        if (dto.getDataNascimento().isAfter(dataLimite)) {
            throw new IllegalArgumentException(
                    "O usuário deve possuir pelo menos 16 anos."
            );
        }

        Usuario usuario = new Usuario();

        usuario.setNomeCompleto(dto.getNomeCompleto().trim());
        usuario.setDataNascimento(dto.getDataNascimento());
        usuario.setCpf(formatarCpf(dto.getCpf()));
        usuario.setEmail(dto.getEmail().trim().toLowerCase());
        usuario.setNumeroTelefone(formatarTelefone(dto.getNumeroTelefone()));
        usuario.setNomeUsuario(dto.getNomeUsuario().trim());
        usuario.setSenha(dto.getSenha());

        return usuario;
    }

    // ENDEREÇO
    public Endereco validaCadastroEndereco(EnderecoDTO dto) {
        // Busca pelo NOME do estado (não pelo id) - o front manda o texto do <select>
        Estado estado = estadoRepository.findByEstado(dto.getEstado().trim())
                .orElseThrow(() -> new IllegalArgumentException("Estado inválido: " + dto.getEstado()));

        Endereco endereco = new Endereco();
        endereco.setCep(formatarCep(dto.getCep()));
        endereco.setRua(dto.getRua().trim());
        endereco.setBairro(dto.getBairro().trim());
        endereco.setNumero(dto.getNumero());
        if (dto.getComplemento() != null && !dto.getComplemento().isBlank()) {
            endereco.setComplemento(dto.getComplemento().trim());
        }
        endereco.setEstado(estado);
        return enderecoRepository.save(endereco);
    }

    // FORMATAÇÕES
    private String formatarCpf(String cpf) {
        cpf = cpf.replaceAll("\\D", "");
        return cpf.replaceFirst(
                "(\\d{3})(\\d{3})(\\d{3})(\\d{2})",
                "$1.$2.$3-$4"
        );
    }

    private String formatarCep(String cep) {
        cep = cep.replaceAll("\\D", "");
        return cep.replaceFirst(
                "(\\d{5})(\\d{3})",
                "$1-$2"
        );
    }

    private String formatarTelefone(String telefone) {
        if (telefone == null || telefone.isBlank()) {
            return null;
        }
        telefone = telefone.replaceAll("\\D", "");
        if (telefone.length() == 11) {
            return telefone.replaceFirst(
                    "(\\d{2})(\\d{5})(\\d{4})",
                    "($1) $2-$3"
            );
        }
        return telefone.replaceFirst(
                "(\\d{2})(\\d{4})(\\d{4})",
                "($1) $2-$3"
        );
    }
}
