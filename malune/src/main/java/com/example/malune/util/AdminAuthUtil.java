package com.example.malune.util;

import com.example.malune.service.AdminAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Utilitário para extrair e validar informações de autenticação do admin.
 * Facilita acesso a dados do token nos Controllers.
 */
@Component
public class AdminAuthUtil {

    @Autowired
    private AdminAuthService adminAuthService;

    /**
     * Extrai o token do header Authorization de uma requisição.
     * 
     * @param request HttpServletRequest
     * @return Token sem prefixo "Bearer ", ou null se não encontrado
     */
    public String getTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || authHeader.isEmpty()) {
            return null;
        }
        return authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
    }

    /**
     * Obtém o ID do admin autenticado a partir do token no header.
     * 
     * @param request HttpServletRequest
     * @return ID do admin, ou -1 se token inválido
     */
    public long getAdminIdFromRequest(HttpServletRequest request) {
        String token = getTokenFromRequest(request);
        if (token == null) {
            return -1;
        }
        return adminAuthService.getAdminIdFromToken(token);
    }
}

