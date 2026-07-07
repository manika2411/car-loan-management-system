package com.loan.backend.service;

import com.loan.backend.dto.PaymentRequest;
import com.loan.backend.entity.Payment;
import java.util.List;

public interface PaymentService {
    Payment payEmi(Long emiId, PaymentRequest request);
    List<Payment> getAllPayments();
    List<Payment> getMyPayments(String email);
}