package com.loan.backend.repository;

import com.loan.backend.entity.LoanAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LoanAccountRepository
        extends JpaRepository<LoanAccount, Long> {
    Optional<LoanAccount> findByLoanApplicationId(Long applicationId);
    Optional<LoanAccount> findByAccountNumber(String accountNumber);
}