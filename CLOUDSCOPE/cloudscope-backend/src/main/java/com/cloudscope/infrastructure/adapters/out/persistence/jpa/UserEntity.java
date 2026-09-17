package com.cloudscope.infrastructure.adapters.out.persistence.jpa;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @Column(name = "id", length = 64, nullable = false)
    private String id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "region", length = 32)
    private String region;

    @Column(name = "created_at")
    private String createdAt;

    public UserEntity() {
        this.id = "user_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        this.createdAt = Instant.now().toString();
    }

    public UserEntity(String firstName, String lastName, String email, String password, String region) {
        this.id = "user_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.region = region != null ? region : "US1";
        this.createdAt = Instant.now().toString();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
