package com.loan.backend.repository;

import com.loan.backend.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository
        extends JpaRepository<Lead, Long> {
}