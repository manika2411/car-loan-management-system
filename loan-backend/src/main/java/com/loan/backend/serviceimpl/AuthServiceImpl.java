package com.loan.backend.serviceimpl;

import com.loan.backend.dto.RegisterRequest;
import com.loan.backend.entity.Role;
import com.loan.backend.repository.RoleRepository;
import com.loan.backend.service.AuthService;
import com.loan.backend.service.OtpService;
import com.loan.backend.entity.User;
import com.loan.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.loan.backend.auth.jwt.JwtService;
import com.loan.backend.dto.LoginRequest;
import com.loan.backend.dto.AuthResponse;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;

    @Override
    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        otpService.sendOtpForRegistration(
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPhone(),
                hashedPassword
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token);
    }
}