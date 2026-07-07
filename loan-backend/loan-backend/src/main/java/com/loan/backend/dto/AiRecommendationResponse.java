package com.loan.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AiRecommendationResponse {
    private String recommendation;
    private String risk;
    private String confidence;
    private String reason;
}