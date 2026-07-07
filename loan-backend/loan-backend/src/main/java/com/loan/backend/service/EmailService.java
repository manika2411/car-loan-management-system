package com.loan.backend.service;

public interface EmailService {
    void sendOtpEmail(String toEmail, String code);
}