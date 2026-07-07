package com.loan.backend.controller;

import com.loan.backend.dto.CreateLoanAccountRequest;
import com.loan.backend.entity.LoanAccount;
import com.loan.backend.service.LoanAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan-accounts")
@RequiredArgsConstructor
public class LoanAccountController {

    private final LoanAccountService service;

    @PreAuthorize("hasAnyRole('ADMIN','LOAN_OFFICER')")
    @PostMapping
    public LoanAccount createLoanAccount(
            @RequestBody CreateLoanAccountRequest request
    ) {
        return service.createLoanAccount(request);
    }

    @PreAuthorize("hasAnyRole('ADMIN','LOAN_OFFICER')")
    @GetMapping
    public List<LoanAccount> getAllLoanAccounts() {
        return service.getAllLoanAccounts();
    }

    @PreAuthorize("hasAnyRole('ADMIN','LOAN_OFFICER')")
    @GetMapping("/{id}")
    public LoanAccount getLoanAccount(
            @PathVariable Long id
    ) {
        return service.getLoanAccount(id);
    }

    // CUSTOMER API

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my/{applicationId}")
    public LoanAccount getMyLoanAccount(
            @PathVariable Long applicationId
    ) {
        return service.getLoanAccountByApplicationId(
                applicationId
        );
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/account-number/{accountNumber}")
    public LoanAccount getByAccountNumber(
            @PathVariable String accountNumber) {

        return service.getLoanAccountByAccountNumber(
                accountNumber);
    }
}