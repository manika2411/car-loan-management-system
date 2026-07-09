package com.loan.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateLoanApplicationRequest {
    private Long leadId;
    private String vehicleName;
    private BigDecimal vehiclePrice;
    private BigDecimal downPayment;
    private BigDecimal loanAmount;
    private Double interestRate;
    private Integer tenureMonths;
}