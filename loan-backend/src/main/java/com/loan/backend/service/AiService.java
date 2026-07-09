package com.loan.backend.service;

import com.loan.backend.dto.AiRecommendationResponse;

public interface AiService {
    AiRecommendationResponse analyzeLoan(Long applicationId);
}