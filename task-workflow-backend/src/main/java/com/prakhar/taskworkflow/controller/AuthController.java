package com.prakhar.taskworkflow.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prakhar.taskworkflow.dto.LoginRequest;
import com.prakhar.taskworkflow.dto.RegisterRequest;
import com.prakhar.taskworkflow.dto.UserCreateRequest;
import com.prakhar.taskworkflow.dto.UserResponse;
import com.prakhar.taskworkflow.entity.User;
import com.prakhar.taskworkflow.repository.UserRepository;
import com.prakhar.taskworkflow.service.AuthService;
import com.prakhar.taskworkflow.service.UserService;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authservice) {

        this.authService = authservice;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
    	String token = authService.login(request);
        return ResponseEntity.ok(token);
    }
    
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }
}
