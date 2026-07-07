package com.loan.backend.serviceimpl;

import com.loan.backend.dto.CreateLeadRequest;
import com.loan.backend.dto.UpdateLeadStatusRequest;
import com.loan.backend.entity.Lead;
import com.loan.backend.repository.LeadRepository;
import com.loan.backend.service.LeadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;

    @Override
    public Lead createLead(CreateLeadRequest request) {

        Lead lead = Lead.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .interestedVehicle(request.getInterestedVehicle())
                .build();

        return leadRepository.save(lead);
    }

    @Override
    public List<Lead> getAllLeads() {
        return leadRepository.findAll();
    }

    @Override
    public Lead getLeadById(Long id) {

        return leadRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found"));
    }

    @Override
    public Lead updateLeadStatus(
            Long id,
            UpdateLeadStatusRequest request) {

        Lead lead = leadRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found"));

        lead.setStatus(request.getStatus());

        return leadRepository.save(lead);
    }

    @Override
    public void deleteLead(Long id) {

        Lead lead = leadRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Lead not found"));

        leadRepository.delete(lead);
    }
}