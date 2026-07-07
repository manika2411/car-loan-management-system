package com.loan.backend.service;

import com.loan.backend.dto.CreateLeadNoteRequest;
import com.loan.backend.entity.LeadNote;

import java.util.List;

public interface LeadNoteService {

    LeadNote createNote(
            Long leadId,
            CreateLeadNoteRequest request);

    List<LeadNote> getLeadNotes(Long leadId);
}