package com.loan.backend.repository;

import com.loan.backend.entity.LeadNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadNoteRepository
        extends JpaRepository<LeadNote, Long> {

    List<LeadNote> findByLeadId(Long leadId);
}