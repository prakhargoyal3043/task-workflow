package com.prakhar.taskworkflow.config;

import com.prakhar.taskworkflow.entity.Role;
import com.prakhar.taskworkflow.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {

            if (roleRepository.findByName("ADMIN") == null) {
                roleRepository.save(new Role("ADMIN"));
            }

            if (roleRepository.findByName("MANAGER") == null) {
                roleRepository.save(new Role("MANAGER"));
            }

            if (roleRepository.findByName("USER") == null) {
                roleRepository.save(new Role("USER"));
            }
        };
    }
}
