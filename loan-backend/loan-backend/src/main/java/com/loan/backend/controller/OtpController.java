package com.loan.backend.controller;

import com.loan.backend.dto.SendOtpRequest;
import com.loan.backend.dto.VerifyOtpRequest;
import com.loan.backend.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/send")
    public Map<String, String> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        otpService.sendOtp(request.getEmail());
        return Map.of("message", "OTP sent successfully");
    }

    @PostMapping("/verify")
    public Map<String, String> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        otpService.verifyOtp(request.getEmail(), request.getCode());
        return Map.of("message", "Email verified successfully");
    }
}