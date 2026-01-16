package com.prakhar.taskworkflow.config;

import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.prakhar.taskworkflow.entity.Role;
import com.prakhar.taskworkflow.entity.User;
import com.prakhar.taskworkflow.repository.RoleRepository;
import com.prakhar.taskworkflow.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      RoleRepository roleRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (userRepository.existsByEmail("admin@taskworkflow.com")) {
            return;
        }

        Role adminRole = roleRepository.findByName("ADMIN");

        User admin = new User();
        admin.setName("Super Admin");
        admin.setEmail("admin@taskworkflow.com");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setRoles(Set.of(adminRole));

        userRepository.save(admin);
    }
}
