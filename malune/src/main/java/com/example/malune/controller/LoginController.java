package com.example.malune.controller;

import com.example.malune.dto.LoginDTO;
import com.example.malune.service.LoginService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/login")
public class LoginController {


    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping
    public String login(@Valid @RequestBody LoginDTO loginDTO) {
        return loginService.identificarLogin(loginDTO);
    }
}