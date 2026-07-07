package com.loan.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/test")
public class TestController {
    @GetMapping
    public String test() throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject("https://huggingface.co", String.class);
        return "Success";
    }
}