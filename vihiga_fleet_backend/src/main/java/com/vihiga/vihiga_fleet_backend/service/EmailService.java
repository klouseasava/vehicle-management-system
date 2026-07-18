package com.vihiga.vihiga_fleet_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    // Spring automatically injects the configured JavaMailSender bean
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends a basic text email message.
     * @param to The recipient's email address (e.g., user@vihiga.go.ke)
     * @param subject The email subject line
     * @param body The text content of the email
     */
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    /**
     * Helper specifically for sending VFMS 6-digit verification codes.
     */
    public void sendOtpVerification(String to, String otpCode) {
        String subject = "VFMS Account Verification Code";
        String body = "Hello,\n\n"
                    + "Your 6-digit verification code for the Vihiga County Fleet Management System is: " + otpCode + "\n\n"
                    + "This code will expire in 5 minutes. If you did not request this code, please ignore this email.\n\n"
                    + "Regards,\n"
                    + "Vihiga County Government Fleet Operations";
        
        sendEmail(to, subject, body);
    }
}