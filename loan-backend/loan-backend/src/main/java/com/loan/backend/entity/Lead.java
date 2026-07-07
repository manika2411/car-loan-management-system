package com.loan.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    @Column(nullable = false)
    private String phone;
    private String email;
    private String interestedVehicle;
    @Enumerated(EnumType.STRING)
    private LeadStatus status;
    private LocalDateTime createdAt;
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = LeadStatus.NEW;
        }
    }
}