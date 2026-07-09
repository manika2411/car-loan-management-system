package com.loan.backend.service;

import com.loan.backend.dto.AuthResponse;
import com.loan.backend.dto.LoginRequest;
import com.loan.backend.dto.RegisterRequest;

public interface AuthService {

    void register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}