package com.loan.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lead_id")
    private Lead lead;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private String vehicleName;
    private BigDecimal vehiclePrice;
    private BigDecimal downPayment;
    private BigDecimal loanAmount;
    private Double interestRate;
    private Integer tenureMonths;
    private BigDecimal monthlyEmi;
    @Enumerated(EnumType.STRING)
    private LoanApplicationStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        submittedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = LoanApplicationStatus.SUBMITTED;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}