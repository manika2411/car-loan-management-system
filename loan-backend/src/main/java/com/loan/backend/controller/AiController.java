package com.loan.backend.controller;

import com.loan.backend.dto.AiRecommendationResponse;
import com.loan.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @GetMapping("/recommend/{applicationId}")
    public AiRecommendationResponse getRecommendation(
            @PathVariable Long applicationId,
            Authentication authentication) {

        System.out.println("USER = " + authentication.getName());
        System.out.println("AUTHORITIES = " + authentication.getAuthorities());
        return aiService.analyzeLoan(applicationId);
    }
}