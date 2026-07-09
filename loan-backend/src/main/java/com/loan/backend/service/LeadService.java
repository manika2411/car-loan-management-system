package com.loan.backend.service;

import com.loan.backend.dto.CreateLeadRequest;
import com.loan.backend.dto.UpdateLeadStatusRequest;
import com.loan.backend.entity.Lead;

import java.util.List;

public interface LeadService {

    Lead createLead(CreateLeadRequest request);
    List<Lead> getAllLeads();
    Lead getLeadById(Long id);
    Lead updateLeadStatus(Long id, UpdateLeadStatusRequest request);
    void deleteLead(Long id);
}