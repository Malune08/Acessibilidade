package com.example.malune.controller;

import com.example.malune.service.AdminAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/api/auth")
public class AdminAuthController {

    @Autowired
    private AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            if (body == null) {
                throw new IllegalArgumentException("Dados de login são obrigatórios");
            }
            String usernameOrEmail = body.get("usernameOrEmail");
            String senha = body.get("senha");
            
            Map<String, Object> result = adminAuthService.login(usernameOrEmail, senha);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || authHeader.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Token não fornecido"));
            }

            String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
            adminAuthService.logout(token);
            
            return ResponseEntity.ok(Map.of("message", "Logout realizado com sucesso"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erro ao realizar logout"));
        }
    }
}
