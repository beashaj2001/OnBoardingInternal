package com.onboarding.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String email;
    private String password;
    private String role; // e.g., "TRAINEE", "TRAINER"
    private String firstName;
    private String lastName;
}