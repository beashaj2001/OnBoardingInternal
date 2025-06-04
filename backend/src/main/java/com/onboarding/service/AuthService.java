package com.onboarding.service;

import com.onboarding.dto.LoginRequest;
import com.onboarding.dto.SignupRequest;
import com.onboarding.model.User;

public interface AuthService {
    User signup(SignupRequest signupRequest);

    User login(LoginRequest loginRequest);
}