package com.loan.backend.controller;

import com.loan.backend.dto.PaymentRequest;
import com.loan.backend.entity.Payment;
import com.loan.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService service;
    @PreAuthorize("hasAnyRole('ADMIN','CUSTOMER')")
    @PostMapping("/pay/{emiId}")
    public Payment payEmi(@PathVariable Long emiId, @RequestBody PaymentRequest request) {
        return service.payEmi(emiId, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Payment> getAllPayments() {
        return service.getAllPayments();
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my")
    public List<Payment> getMyPayments(Authentication authentication) {
        System.out.println(authentication.getAuthorities());
        return service.getMyPayments(authentication.getName());
    }
}