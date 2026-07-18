package com.vihiga.vihiga_fleet_backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vihiga.vihiga_fleet_backend.dto.OtpRequestDto;
import com.vihiga.vihiga_fleet_backend.dto.OtpVerifyDto;
import com.vihiga.vihiga_fleet_backend.model.User;
import com.vihiga.vihiga_fleet_backend.repository.UserRepository;
import com.vihiga.vihiga_fleet_backend.service.EmailService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public AuthController(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody OtpRequestDto request) {
        String code = String.format("%06d", new Random().nextInt(999999));
        
        if (request.is_login()) {
            // Login Verification Flow
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(request.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid credentials. Check your email or password."));
            }
            
            User user = userOpt.get();
            user.setVerificationCode(code);
            userRepository.save(user);
        } else {
            // New Registration Flow
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "An account with this email already exists."));
            }

            User newUser = new User();
            newUser.setEmail(request.getEmail());
            newUser.setPassword(request.getPassword()); 
            newUser.setFullName(request.getFull_name());
            newUser.setWorkId(request.getWork_id());
            newUser.setDepartment(request.getDepartment());
            newUser.setVerificationCode(code);
            userRepository.save(newUser);
        }

        // Dispatch OTP code securely via SMTP
        try {
            emailService.sendOtpVerification(request.getEmail(), code);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to dispatch verification email."));
        }

        return ResponseEntity.ok(Map.of("message", "Verification code sent successfully."));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerifyDto verifyRequest) {
        Optional<User> userOpt = userRepository.findByEmail(verifyRequest.getEmail());

        if (userOpt.isEmpty() || userOpt.get().getVerificationCode() == null 
                || !userOpt.get().getVerificationCode().equals(verifyRequest.getCode())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired code. Please try again."));
        }

        User user = userOpt.get();
        user.setVerificationCode(null); // Wipe temporary OTP code on success
        userRepository.save(user);

        // Build runtime authentication layout expected by React Frontend Context
        Map<String, Object> response = new HashMap<>();
        response.put("access_token", "mock-jwt-token-for-" + user.getEmail());
        
        return ResponseEntity.ok(response);
    }
}