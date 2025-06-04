package com.onboarding.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class LeaderboardDTO {
    private String id;

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "User name is required")
    private String userName;

    @NotNull(message = "Score is required")
    private int score;

    private int completedModules;
    private int totalModules;
    private String lastUpdatedAt;

    public LeaderboardDTO() {
    }

    // Constructor matching the fields needed for the leaderboard calculation
    public LeaderboardDTO(String id, String userId, String userName, int score, int completedModules, int totalModules,
            String lastUpdatedAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.score = score;
        this.completedModules = completedModules;
        this.totalModules = totalModules;
        this.lastUpdatedAt = lastUpdatedAt;
    }

    // Existing constructor from the previous state of ModuleDTO
    // This constructor might not be used for Leaderboard but keeping it for
    // completeness based on the file content
    // Note: This seems like a leftover from a previous copy/paste or merge issue,
    // as this constructor doesn't fit the LeaderboardDTO fields.
    // It's safer to remove it or confirm its actual usage if this was intended.
    // Removing for now as it seems out of place.
    /*
     * public LeaderboardDTO(String id, String title, String description, String
     * duration, String image,
     * String type, boolean isMandatory, int order, boolean active) {
     * this.id = id;
     * this.title = title;
     * this.description = description;
     * this.duration = duration;
     * this.image = image;
     * this.type = type;
     * this.isMandatory = isMandatory;
     * this.order = order;
     * this.active = active;
     * this.status = "NOT_STARTED";
     * this.completionPercentage = 0;
     * this.hasAssessment = false;
     * this.assessmentCompleted = false;
     * this.assessmentScore = null;
     * }
     */
}