package com.onboarding.controller;

import com.onboarding.model.UserProgress;
import com.onboarding.service.UserProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class UserProgressController {

    private final UserProgressService userProgressService;

    @Autowired
    public UserProgressController(UserProgressService userProgressService) {
        this.userProgressService = userProgressService;
    }

    // Endpoint to get all user progress entries
    @GetMapping("/all")
    public ResponseEntity<List<UserProgress>> getAllUserProgress() {
        List<UserProgress> allProgress = userProgressService.getAllUserProgress();
        return ResponseEntity.ok(allProgress);
    }
}