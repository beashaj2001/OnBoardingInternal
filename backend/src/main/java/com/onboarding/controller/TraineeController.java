package com.onboarding.controller;

import com.onboarding.dto.AchievementDto;
import com.onboarding.dto.LeaderboardEntryDto;
import com.onboarding.dto.ModuleDTO;
import com.onboarding.dto.TraineeStatsDto;
import com.onboarding.service.TraineeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainees")
public class TraineeController {

    private final TraineeService traineeService;

    @Autowired
    public TraineeController(TraineeService traineeService) {
        this.traineeService = traineeService;
    }

    @GetMapping("/{userId}/stats")
    public ResponseEntity<TraineeStatsDto> getTraineeStats(@PathVariable String userId) {
        TraineeStatsDto traineeStats = traineeService.getTraineeStats(userId);
        return ResponseEntity.ok(traineeStats);
    }

    @GetMapping("/{userId}/achievements")
    public ResponseEntity<List<AchievementDto>> getTraineeAchievements(@PathVariable String userId) {
        List<AchievementDto> achievements = traineeService.getTraineeAchievements(userId);
        return ResponseEntity.ok(achievements);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboardData() {
        List<LeaderboardEntryDto> leaderboard = traineeService.getLeaderboardData();
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/{userId}/modules")
    public ResponseEntity<List<ModuleDTO>> getTraineeModules(@PathVariable String userId) {
        List<ModuleDTO> modules = traineeService.getTraineeModules(userId);
        return ResponseEntity.ok(modules);
    }
}