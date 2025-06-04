package com.onboarding.controller;

import com.onboarding.dto.TrainerDashboardStatsDTO;
import com.onboarding.dto.TraineeDashboardDTO;
import com.onboarding.service.TrainerDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trainer/dashboard")
public class TrainerDashboardController {

    private final TrainerDashboardService trainerDashboardService;

    @Autowired
    public TrainerDashboardController(TrainerDashboardService trainerDashboardService) {
        this.trainerDashboardService = trainerDashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<TrainerDashboardStatsDTO> getTrainerDashboardStats() {
        TrainerDashboardStatsDTO stats = trainerDashboardService.getTrainerDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent-trainees")
    public ResponseEntity<List<TraineeDashboardDTO>> getRecentTrainees(
            @RequestParam(defaultValue = "5") int limit) {
        List<TraineeDashboardDTO> recentTrainees = trainerDashboardService.getRecentTrainees(limit);
        return ResponseEntity.ok(recentTrainees);
    }
}