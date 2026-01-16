package com.prakhar.taskworkflow.controller;

import java.util.List;
import java.util.Set;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.prakhar.taskworkflow.dto.UserCreateRequest;
import com.prakhar.taskworkflow.dto.UserResponse;
import com.prakhar.taskworkflow.entity.Role;
import com.prakhar.taskworkflow.entity.User;
import com.prakhar.taskworkflow.repository.RoleRepository;
import com.prakhar.taskworkflow.repository.UserRepository;
import com.prakhar.taskworkflow.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository,
                          RoleRepository roleRepository,
                          UserService userService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userService = userService;
    }

    // ✅ Logged-in user profile
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(userService.mapToUserResponse(user));
    }

    // ✅ ADMIN – Get all users
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }
    
 // ✅ MANAGER – Get all users
    @GetMapping("/all-users")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        String role = "USER";
        return ResponseEntity.ok(userService.getUsers(role, pageable));
    }

    // ✅ ADMIN – Register user
    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> registerUser(
            @Valid @RequestBody UserCreateRequest request) {

        userService.createUser(request);
        return ResponseEntity.ok("User created successfully");
    }

    // ✅ ADMIN – Assign roles
    @PutMapping("/{userId}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> assignRoles(
            @PathVariable Long userId,
            @RequestBody Set<String> roleNames) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<Role> roles = roleRepository.findByNameIn(roleNames);
        user.setRoles(roles);

        userRepository.save(user);
        return ResponseEntity.ok("Roles updated successfully");
    }

    // ✅ ADMIN – Delete user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.softDeleteUser(id);
        return ResponseEntity.ok("User soft deleted");
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/make-manager")
    public ResponseEntity<String> makeManager(@PathVariable Long userId) {
        userService.assignManagerRole(userId);
        return ResponseEntity.ok("User promoted to MANAGER");
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{userId}/demote-manager")
    public ResponseEntity<String> demoteManager(@PathVariable Long userId) {
        userService.removeManagerRole(userId);
        return ResponseEntity.ok("Manager demoted to USER");
    }
}
