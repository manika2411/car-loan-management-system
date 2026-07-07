package com.loan.backend.controller;

import com.loan.backend.entity.EmiSchedule;
import com.loan.backend.service.EmiScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/emi-schedules")
@RequiredArgsConstructor
public class EmiScheduleController {
    private final EmiScheduleService service;
    @PreAuthorize("hasAnyRole('ADMIN','LOAN_OFFICER')")
    @PostMapping("/generate/{loanAccountId}")
    public List<EmiSchedule> generateSchedule(@PathVariable Long loanAccountId) {
        return service.generateSchedule(loanAccountId);
    }

    @PreAuthorize("hasAnyRole('ADMIN','LOAN_OFFICER','CUSTOMER')")
    @GetMapping("/loan-account/{loanAccountId}")
    public List<EmiSchedule> getSchedule(@PathVariable Long loanAccountId) {
        return service.getSchedule(loanAccountId);
    }
}