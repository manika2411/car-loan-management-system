package com.loan.backend.serviceimpl;

import com.loan.backend.entity.Lead;
import com.loan.backend.repository.LeadRepository;
import com.loan.backend.dto.CreateLeadNoteRequest;
import com.loan.backend.entity.LeadNote;
import com.loan.backend.repository.LeadNoteRepository;
import com.loan.backend.service.LeadNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadNoteServiceImpl
        implements LeadNoteService {

    private final LeadRepository leadRepository;
    private final LeadNoteRepository leadNoteRepository;

    @Override
    public LeadNote createNote(
            Long leadId,
            CreateLeadNoteRequest request) {

        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found"));

        LeadNote note = LeadNote.builder()
                .note(request.getNote())
                .lead(lead)
                .build();

        return leadNoteRepository.save(note);
    }

    @Override
    public List<LeadNote> getLeadNotes(Long leadId) {

        return leadNoteRepository.findByLeadId(leadId);
    }
}