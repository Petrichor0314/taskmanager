package com.hahn.taskmanager.config;

import com.hahn.taskmanager.entity.User;
import com.hahn.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create a default test user if not exists
        if (!userRepository.existsByEmail("test@example.com")) {
            User testUser = User.builder()
                    .fullName("Test User")
                    .email("test@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .build();
            userRepository.save(testUser);
            log.info("Default test user created: test@example.com / password123");
        }

        if (!userRepository.existsByEmail("admin@hahn.com")) {
            User adminUser = User.builder()
                    .fullName("Admin User")
                    .email("admin@hahn.com")
                    .password(passwordEncoder.encode("admin123"))
                    .build();
            userRepository.save(adminUser);
            log.info("Admin user created: admin@hahn.com / admin123");
        }
    }
}
