package com.loan.backend.controller;

import com.loan.backend.dto.CreateLoanApplicationRequest;
import com.loan.backend.entity.LoanApplication;
import com.loan.backend.service.LoanApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loan-applications")
@RequiredArgsConstructor
public class LoanApplicationController {

    private final LoanApplicationService service;
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    @PostMapping
    public LoanApplication createApplication(
            @RequestBody CreateLoanApplicationRequest request) {

        return service.createApplication(request);
    }

    @PreAuthorize("hasAnyRole('ADMIN','LOAN_OFFICER')")
    @GetMapping
    public List<LoanApplication> getAllApplications() {

        return service.getAllApplications();
    }

    @PreAuthorize("hasAnyRole('ADMIN','LOAN_OFFICER')")
    @GetMapping("/{id}")
    public LoanApplication getApplication(
            @PathVariable Long id) {

        return service.getApplication(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','LOAN_OFFICER')")
    @PutMapping("/{id}/review")
    public LoanApplication reviewApplication(
            @PathVariable Long id) {

        return service.reviewApplication(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','LOAN_OFFICER')")
    @PutMapping("/{id}/approve")
    public LoanApplication approveApplication(
            @PathVariable Long id) {

        return service.approveApplication(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','LOAN_OFFICER')")
    @PutMapping("/{id}/reject")
    public LoanApplication rejectApplication(
            @PathVariable Long id) {

        return service.rejectApplication(id);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my")
    public List<LoanApplication> getMyApplications() {

        return service.getMyApplications();
    }
}