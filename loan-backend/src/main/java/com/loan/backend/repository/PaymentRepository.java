package com.loan.backend.repository;

import com.loan.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Query("""
    SELECT p
    FROM Payment p
    WHERE p.emiSchedule.loanAccount.loanApplication.user.email = :email
""")
    List<Payment> findByCustomerEmail(
            @Param("email") String email
    );
}