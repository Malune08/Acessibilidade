package com.example.malune.service;

import com.example.malune.entity.Administrador;
import com.example.malune.repository.AdmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AdminAuthService {

    @Autowired
    private AdmRepository admRepository;

    private final Map<String, TokenInfo> activeTokens = new ConcurrentHashMap<>();
    private static final long TOKEN_EXPIRATION_TIME = 8 * 60 * 60 * 1000;

    public Map<String, Object> login(String usernameOrEmail, String senha) {
        if (usernameOrEmail == null || usernameOrEmail.isBlank() || senha == null || senha.isBlank()) {
            throw new IllegalArgumentException("usernameOrEmail and senha are required");
        }

        usernameOrEmail = usernameOrEmail.trim();

        Optional<Administrador> admOpt = admRepository.findByEmailIgnoreCase(usernameOrEmail);
        if (admOpt.isEmpty()) {
            admOpt = admRepository.findByNomeUsuarioIgnoreCase(usernameOrEmail);
        }

        if (admOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        Administrador adm = admOpt.get();

        if (!adm.getSenha().equals(senha)) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = createToken(adm.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("id", adm.getId());
        response.put("nomeUsuario", adm.getNomeUsuario());
        response.put("email", adm.getEmail());
        response.put("token", token);
        response.put("expiresIn", TOKEN_EXPIRATION_TIME / 1000);
        
        return response;
    }

    public String createToken(long admId) {
        String token = UUID.randomUUID().toString() + "-" + System.nanoTime();
        long expirationTime = System.currentTimeMillis() + TOKEN_EXPIRATION_TIME;
        
        activeTokens.put(token, new TokenInfo(admId, expirationTime));
        
        return token;
    }

    public boolean validateAdminToken(String token) {
        TokenInfo tokenInfo = activeTokens.get(token);
        
        if (tokenInfo == null) {
            return false;
        }

        if (System.currentTimeMillis() > tokenInfo.expirationTime) {
            activeTokens.remove(token);
            return false;
        }

        tokenInfo.expirationTime = System.currentTimeMillis() + TOKEN_EXPIRATION_TIME;
        
        return true;
    }

    public long getAdminIdFromToken(String token) {
        TokenInfo tokenInfo = activeTokens.get(token);
        return (tokenInfo != null) ? tokenInfo.admId : -1;
    }

    public void logout(String token) {
        activeTokens.remove(token);
    }

    public Optional<Administrador> findById(Integer id) {
        return admRepository.findById(id);
    }

    private static class TokenInfo {
        long admId;
        long expirationTime;

        TokenInfo(long admId, long expirationTime) {
            this.admId = admId;
            this.expirationTime = expirationTime;
        }
    }
}

