package com.loan.backend.serviceimpl;

import com.loan.backend.entity.Otp;
import com.loan.backend.entity.Role;
import com.loan.backend.entity.User;
import com.loan.backend.repository.OtpRepository;
import com.loan.backend.repository.RoleRepository;
import com.loan.backend.repository.UserRepository;
import com.loan.backend.service.EmailService;
import com.loan.backend.service.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmailService emailService;

    private static final int OTP_VALID_MINUTES = 5;

    @Override
    public void sendOtpForRegistration(String firstName, String lastName, String email, String phoneNumberUnused, String hashedPassword) {
        String code = generateCode();
        Otp otp = Otp.builder()
                .phone(email)
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_VALID_MINUTES))
                .used(false)
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .hashedPassword(hashedPassword)
                .build();
        otpRepository.save(otp);
        emailService.sendOtpEmail(email, code);
    }

    @Override
    public void sendOtp(String email) {
        Otp latest = otpRepository
                .findTopByPhoneAndUsedFalseOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new RuntimeException("No pending registration found for this email"));
        String code = generateCode();
        Otp otp = Otp.builder()
                .phone(email)
                .code(code)
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_VALID_MINUTES))
                .used(false)
                .firstName(latest.getFirstName())
                .lastName(latest.getLastName())
                .email(latest.getEmail())
                .hashedPassword(latest.getHashedPassword())
                .build();

        otpRepository.save(otp);
        emailService.sendOtpEmail(email, code);
        System.out.println("OTP resent to " + email + " — code: " + code);
    }

    @Override
    public boolean verifyOtp(String email, String code) {

        Otp otp = otpRepository.findTopByPhoneAndUsedFalseOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new RuntimeException("No OTP found for this email"));

        if (otp.isUsed()) {
            throw new RuntimeException("OTP already used");
        }

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired, please register again");
        }

        if (!otp.getCode().equals(code)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (userRepository.existsByEmail(otp.getEmail())) {
            throw new RuntimeException("This email is already registered");
        }

        Role customerRole = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Role not found"));

        User user = User.builder()
                .firstName(otp.getFirstName())
                .lastName(otp.getLastName())
                .email(otp.getEmail())
                .phone(otp.getPhone())
                .password(otp.getHashedPassword())
                .enabled(true)
                .phoneVerified(true)
                .roles(Set.of(customerRole))
                .build();

        userRepository.save(user);
        otp.setUsed(true);
        otpRepository.save(otp);

        return true;
    }

    private String generateCode() {
        SecureRandom random = new SecureRandom();
        int otpNum = 100000 + random.nextInt(900000);
        return String.valueOf(otpNum);
    }
}