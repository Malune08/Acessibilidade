package com.example.malune.interceptor;

import com.example.malune.service.AdminAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    @Autowired
    private AdminAuthService adminAuthService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        
        if (request.getRequestURI().equals("/admin/api/auth/login") && "POST".equals(request.getMethod())) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || authHeader.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token de autenticação não fornecido\"}");
            return false;
        }

        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

        if (!adminAuthService.validateAdminToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token inválido ou expirado\"}");
            return false;
        }

        return true;
    }
}


