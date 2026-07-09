package com.loan.backend.dto;

import com.loan.backend.entity.LeadStatus;
import lombok.Data;

@Data
public class UpdateLeadStatusRequest {

    private LeadStatus status;
}