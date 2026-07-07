package com.loan.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
@Data
public class PaymentRequest {
    private BigDecimal amountPaid;
    private String paymentMethod;
    private String transactionReference;
}