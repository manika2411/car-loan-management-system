package com.loan.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateLeadRequest {
    @NotBlank
    private String firstName;
    private String lastName;
    @NotBlank
    private String phone;
    private String email;
    private String interestedVehicle;
}