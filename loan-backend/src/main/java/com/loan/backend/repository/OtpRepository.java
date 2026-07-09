package com.loan.backend.repository;

import com.loan.backend.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findTopByPhoneAndUsedFalseOrderByCreatedAtDesc(String phone);
    
}