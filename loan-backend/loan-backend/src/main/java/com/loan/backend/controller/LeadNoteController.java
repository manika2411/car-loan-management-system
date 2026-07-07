package com.loan.backend.controller;

import com.loan.backend.dto.CreateLeadNoteRequest;
import com.loan.backend.entity.LeadNote;
import com.loan.backend.service.LeadNoteService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads/{leadId}/notes")
@RequiredArgsConstructor
public class LeadNoteController {

    private final LeadNoteService leadNoteService;
    @PreAuthorize("hasAnyRole('ADMIN','SALES_AGENT','LOAN_OFFICER')")
    @PostMapping
    public LeadNote createNote(
            @PathVariable Long leadId,
            @Valid @RequestBody CreateLeadNoteRequest request) {

        return leadNoteService.createNote(
                leadId,
                request);
    }

    @PreAuthorize("hasAnyRole('ADMIN','SALES_AGENT','LOAN_OFFICER')")
    @GetMapping
    public List<LeadNote> getNotes(
            @PathVariable Long leadId) {

        return leadNoteService.getLeadNotes(leadId);
    }
}