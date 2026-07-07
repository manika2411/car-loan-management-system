package com.loan.backend.service;

import com.loan.backend.dto.CreateLoanAccountRequest;
import com.loan.backend.entity.LoanAccount;

import java.util.List;

public interface LoanAccountService {

    LoanAccount createLoanAccount(
            CreateLoanAccountRequest request);
    List<LoanAccount> getAllLoanAccounts();
    LoanAccount getLoanAccount(Long id);
    LoanAccount getLoanAccountByApplicationId(
            Long applicationId);
    LoanAccount getLoanAccountByAccountNumber(
            String accountNumber);
}