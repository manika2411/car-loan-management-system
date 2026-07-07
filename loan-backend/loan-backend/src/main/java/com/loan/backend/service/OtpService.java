package com.loan.backend.service;

public interface OtpService {

    void sendOtpForRegistration(String firstName, String lastName, String email,
                                String phone, String hashedPassword);
    void sendOtp(String email);
    boolean verifyOtp(String email, String code);
}