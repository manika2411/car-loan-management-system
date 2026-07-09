package com.loan.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateLeadNoteRequest {

    @NotBlank
    private String note;
}