package com.onboarding.dto;

import lombok.Data;

@Data
public class ProgressDTO {
    private int completed;
    private int inProgress;
    private int notStarted;
    private String lastActivity;
    private int score;

    public ProgressDTO() {
    }

    public ProgressDTO(int completed, int inProgress, int notStarted, String lastActivity, int score) {
        this.completed = completed;
        this.inProgress = inProgress;
        this.notStarted = notStarted;
        this.lastActivity = lastActivity;
        this.score = score;
    }
}