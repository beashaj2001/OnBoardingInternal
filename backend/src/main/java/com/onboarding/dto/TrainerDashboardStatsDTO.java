package com.onboarding.dto;

import lombok.Data;

@Data
public class TrainerDashboardStatsDTO {
    private long activeTraineesCount;
    private long activeModulesCount;
    private double averageCompletionPercentage;
    private long totalAssessmentsCount;
}