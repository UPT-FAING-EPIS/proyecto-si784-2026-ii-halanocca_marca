package com.cloudscope.infrastructure.adapters.in.web;

import com.cloudscope.infrastructure.adapters.out.persistence.jpa.SpringDataUserRepository;
import com.cloudscope.infrastructure.adapters.out.persistence.jpa.UserEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:80", "http://localhost:3000", "*"})
public class AuthController {

    private final SpringDataUserRepository userRepository;

    public AuthController(SpringDataUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String firstName = request.getOrDefault("firstName", "").trim();
        String lastName = request.getOrDefault("lastName", "").trim();
        String email = request.getOrDefault("email", "").trim().toLowerCase();
        String password = request.getOrDefault("password", "").trim();
        String region = request.getOrDefault("region", "US1").trim();

        if (firstName.isEmpty() || lastName.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Por favor completa todos los campos requeridos.");
            return ResponseEntity.badRequest().body(err);
        }

        if (userRepository.existsByEmail(email)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Ya existe una cuenta con el correo electrónico proporcionado.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
        }

        UserEntity user = new UserEntity(firstName, lastName, email, password, region);
        UserEntity saved = userRepository.save(user);

        String token = Base64.getEncoder().encodeToString(
                ("{\"sub\":\"" + saved.getEmail() + "\",\"name\":\"" + saved.getFirstName() + " " + saved.getLastName() + "\",\"exp\":" + (System.currentTimeMillis() + 86400000) + "}").getBytes()
        );

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Usuario registrado exitosamente.");
        response.put("token", token);
        response.put("user", Map.of(
                "id", saved.getId(),
                "name", saved.getFirstName() + " " + saved.getLastName(),
                "firstName", saved.getFirstName(),
                "lastName", saved.getLastName(),
                "email", saved.getEmail(),
                "region", saved.getRegion()
        ));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.getOrDefault("email", "").trim().toLowerCase();
        String password = request.getOrDefault("password", "").trim();

        // Soporte para credenciales de prueba predefinidas
        if (("admin@cloudscope.io".equals(email) && "admin123".equals(password)) ||
            ("demo@cloudscope.io".equals(email) && "demo123".equals(password))) {
            String role = email.startsWith("admin") ? "admin" : "viewer";
            String name = email.startsWith("admin") ? "Admin User" : "Demo User";
            String token = Base64.getEncoder().encodeToString(
                    ("{\"sub\":\"" + email + "\",\"name\":\"" + name + "\",\"role\":\"" + role + "\"}").getBytes()
            );
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "token", token,
                    "user", Map.of("email", email, "name", name, "role", role)
            ));
        }

        Optional<UserEntity> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Correo electrónico o contraseña incorrectos.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(err);
        }

        UserEntity user = userOpt.get();
        String token = Base64.getEncoder().encodeToString(
                ("{\"sub\":\"" + user.getEmail() + "\",\"name\":\"" + user.getFirstName() + " " + user.getLastName() + "\",\"exp\":" + (System.currentTimeMillis() + 86400000) + "}").getBytes()
        );

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "token", token,
                "user", Map.of(
                        "id", user.getId(),
                        "name", user.getFirstName() + " " + user.getLastName(),
                        "firstName", user.getFirstName(),
                        "lastName", user.getLastName(),
                        "email", user.getEmail(),
                        "region", user.getRegion()
                )
        ));
    }
}
