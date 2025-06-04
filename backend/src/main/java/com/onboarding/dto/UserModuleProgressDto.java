package com.onboarding.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserModuleProgressDto {
    private String id;
    private String userId;
    private String moduleId;
    private int completionPercentage;
    private String status;
    private LocalDateTime lastAccessedAt;
}