package com.loan.backend.serviceimpl;

import com.loan.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String toEmail, String code) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your AutoDrive verification code");
        message.setText("Hi,\n\n" + "Your AutoDrive verification code is: " + code + "\n\n" + "This code is valid for 5 minutes. If you didn't request this, you can ignore this email.\n\n" + "— AutoDrive");

        mailSender.send(message);
    }
}