package com.onboarding.service;

import com.onboarding.model.User;
import com.onboarding.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User findById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public boolean isTrainer(String userId) {
        User user = findById(userId);
        return user != null && "TRAINER".equals(user.getRole());
    }

    public boolean isTrainee(String userId) {
        User user = findById(userId);
        return user != null && "TRAINEE".equals(user.getRole());
    }
}