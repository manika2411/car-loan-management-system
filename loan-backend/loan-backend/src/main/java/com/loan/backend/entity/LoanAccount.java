package com.loan.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_accounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String accountNumber;
    @OneToOne
    @JoinColumn(name = "loan_application_id")
    private LoanApplication loanApplication;
    private BigDecimal principalAmount;
    private Double interestRate;
    private Integer tenureMonths;
    private BigDecimal outstandingAmount;
    @Enumerated(EnumType.STRING)
    private LoanAccountStatus status;
    private LocalDateTime createdAt;
}