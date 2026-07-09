package com.loan.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String firstName;
    private String lastName;

    @Email
    @NotBlank
    private String email;
    private String phone;

    @NotBlank
    private String password;
}