package com.loan.backend.serviceimpl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.loan.backend.dto.AiRecommendationResponse;
import com.loan.backend.entity.LoanApplication;
import com.loan.backend.repository.LoanApplicationRepository;
import com.loan.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService {

    private final LoanApplicationRepository loanApplicationRepository;
    private final RestTemplate restTemplate;

    @Value("${huggingface.api.key}")
    private String apiKey;

    private static final String HF_URL =
            "https://router.huggingface.co/v1/chat/completions";

    @Override
    public AiRecommendationResponse analyzeLoan(Long applicationId) {

        LoanApplication app = loanApplicationRepository.findById(applicationId)
                .orElseThrow(() ->
                        new RuntimeException("Loan application not found"));

        double loanToValue =
                app.getLoanAmount().doubleValue()
                        / app.getVehiclePrice().doubleValue() * 100;

        double downPaymentRatio =
                app.getDownPayment().doubleValue()
                        / app.getVehiclePrice().doubleValue() * 100;

        String prompt = """
                You are an experienced vehicle loan officer.

                Analyze the following loan application.

                Vehicle Price: ₹%s
                Loan Amount: ₹%s
                Down Payment: ₹%s
                Interest Rate: %s%%
                Tenure: %s months
                Monthly EMI: ₹%s

                Loan To Value Ratio: %.2f%%
                Down Payment Ratio: %.2f%%

                Return ONLY this format.

                Recommendation:
                Risk:
                Confidence:
                Reason:
                """
                .formatted(
                        app.getVehiclePrice(),
                        app.getLoanAmount(),
                        app.getDownPayment(),
                        app.getInterestRate(),
                        app.getTenureMonths(),
                        app.getMonthlyEmi(),
                        loanToValue,
                        downPaymentRatio
                );

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey.trim());
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "model", "Qwen/Qwen2.5-7B-Instruct",
                "messages", List.of(
                        Map.of(
                                "role", "user",
                                "content", prompt
                        )
                ),
                "stream", false
        );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        try {

            System.out.println("========== AI REQUEST ==========");
            System.out.println(body);

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            HF_URL,
                            HttpMethod.POST,
                            request,
                            String.class
                    );

            System.out.println("========== AI RESPONSE ==========");
            System.out.println(response.getBody());

            ObjectMapper mapper = new ObjectMapper();

            JsonNode root =
                    mapper.readTree(response.getBody());

            String aiText =
                    root.path("choices")
                            .path(0)
                            .path("message")
                            .path("content")
                            .asText();

            return new AiRecommendationResponse(
                    "AI Generated",
                    "Calculated",
                    "Estimated",
                    aiText
            );

        } catch (HttpStatusCodeException e) {

            System.out.println("========== HF ERROR ==========");
            System.out.println(e.getStatusCode());
            System.out.println(e.getResponseBodyAsString());

            throw new RuntimeException(
                    "Hugging Face Error : "
                            + e.getResponseBodyAsString()
            );

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Failed to call Hugging Face API",
                    e
            );
        }
    }
}