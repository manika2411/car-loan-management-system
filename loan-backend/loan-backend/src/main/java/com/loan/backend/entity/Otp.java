package com.loan.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "otps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Otp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phone;
    private String code;
    private LocalDateTime expiresAt;
    private boolean used;
    private LocalDateTime createdAt;
    private String firstName;
    private String lastName;
    private String email;
    private String hashedPassword;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}