package com.prakhar.taskworkflow.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.prakhar.taskworkflow.dto.RegisterRequest;
import com.prakhar.taskworkflow.dto.UserCreateRequest;
import com.prakhar.taskworkflow.dto.UserResponse;
import com.prakhar.taskworkflow.entity.Role;
import com.prakhar.taskworkflow.entity.User;
import com.prakhar.taskworkflow.exception.ResourceNotFoundException;
import com.prakhar.taskworkflow.repository.RoleRepository;
import com.prakhar.taskworkflow.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void createUser(UserCreateRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // ✅ hashing

        Set<Role> roles = roleRepository.findByNameIn(request.getRoles());
        user.setRoles(roles);

        userRepository.save(user);
    }

    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAllByDeletedFalse(pageable);
    }
    
    public Page<User> getUsers(String role, Pageable pageable){
    	return userRepository.findAllActiveUsersByRole(role, pageable);
    }

    public void softDeleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN"));

        if (isAdmin) {
            throw new IllegalStateException("Cannot delete ADMIN user");
        }

        user.setDeleted(true);
        userRepository.save(user);
    }

    public UserResponse mapToUserResponse(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRoles(
            user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet())
        );
        return dto;
    }
    
    public void registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // hash

        // Default role USER
        Role userRole = roleRepository.findByName("USER");
        user.setRoles(Set.of(userRole));

        userRepository.save(user);
    }

    public void assignManagerRole(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Role managerRole = roleRepository.findByName("MANAGER");

        user.getRoles().clear(); 
        user.getRoles().add(managerRole);
        userRepository.save(user);
    }
    
    public void removeManagerRole(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Prevent demoting ADMIN
        boolean isAdmin = user.getRoles().stream()
                .anyMatch(r -> r.getName().equals("ADMIN"));

        if (isAdmin) {
            throw new ResourceNotFoundException("Cannot demote ADMIN user");
        }

        // Fetch managed USER role from DB
        Role userRole = roleRepository.findByName("USER");

        if (userRole == null) {
            throw new ResourceNotFoundException("USER role not found");
        }

        // Clear existing roles (MANAGER)
        user.getRoles().clear();

        // Assign USER role
        user.getRoles().add(userRole);

        userRepository.save(user);
    }


}
