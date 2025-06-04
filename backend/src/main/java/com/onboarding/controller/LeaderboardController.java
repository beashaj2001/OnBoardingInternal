package com.onboarding.controller;

import com.onboarding.dto.LeaderboardDTO;
import com.onboarding.service.LeaderboardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {
    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardDTO>> getAllLeaderboards() {
        return ResponseEntity.ok(leaderboardService.getAllLeaderboards());
    }

    @GetMapping("/top")
    public ResponseEntity<List<LeaderboardDTO>> getTopLeaderboards() {
        return ResponseEntity.ok(leaderboardService.getTopLeaderboards());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<LeaderboardDTO> getLeaderboardByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(leaderboardService.getLeaderboardByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<LeaderboardDTO> createOrUpdateLeaderboard(
            @Valid @RequestBody LeaderboardDTO leaderboardDTO) {
        return ResponseEntity.ok(leaderboardService.createOrUpdateLeaderboard(leaderboardDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaderboard(@PathVariable String id) {
        leaderboardService.deleteLeaderboard(id);
        return ResponseEntity.ok().build();
    }
}