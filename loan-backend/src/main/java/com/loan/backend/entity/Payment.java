package com.loan.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "emi_schedule_id")
    private EmiSchedule emiSchedule;
    private BigDecimal amountPaid;
    private String paymentMethod;
    private String transactionReference;
    private LocalDateTime paymentDate;
}