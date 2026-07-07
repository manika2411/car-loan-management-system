package com.loan.backend.controller;

import com.loan.backend.dto.CreateLeadRequest;
import com.loan.backend.dto.UpdateLeadStatusRequest;
import com.loan.backend.entity.Lead;
import com.loan.backend.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;
    @PreAuthorize("hasAnyRole('ADMIN','SALES_AGENT','LOAN_OFFICER')")
    @PostMapping
    public Lead createLead(@RequestBody CreateLeadRequest request) {
        return leadService.createLead(request);
    }

    @PreAuthorize("hasAnyRole('ADMIN','SALES_AGENT','LOAN_OFFICER')")
    @GetMapping
    public List<Lead> getAllLeads() {
        return leadService.getAllLeads();
    }

    @PreAuthorize("hasAnyRole('ADMIN','SALES_AGENT','LOAN_OFFICER')")
    @GetMapping("/{id}")
    public Lead getLeadById(
            @PathVariable Long id) {

        return leadService.getLeadById(id);
    }

    @PreAuthorize("hasAnyRole('ADMIN','SALES_AGENT','LOAN_OFFICER')")
    @PutMapping("/{id}/status")
    public Lead updateLeadStatus(
            @PathVariable Long id,
            @RequestBody UpdateLeadStatusRequest request) {

        return leadService.updateLeadStatus(id, request);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return "Lead deleted successfully";
    }
}