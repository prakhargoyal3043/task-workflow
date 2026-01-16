package com.prakhar.taskworkflow.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.prakhar.taskworkflow.config.JwtUtil;
import com.prakhar.taskworkflow.dto.LoginRequest;
import com.prakhar.taskworkflow.dto.RegisterRequest;
import com.prakhar.taskworkflow.entity.User;
import com.prakhar.taskworkflow.repository.UserRepository;
import com.prakhar.taskworkflow.service.UserService;

@Service
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthService(AuthenticationManager authManager,
                       JwtUtil jwtUtil,
                       UserService userService,
                       UserRepository userRepository) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.userRepository= userRepository;
    }

    // Login API
    public String login(LoginRequest request) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return jwtUtil.generateToken(user);
    }

    // Registration API
    public void register(RegisterRequest request) {
        userService.registerUser(request);
    }
}
