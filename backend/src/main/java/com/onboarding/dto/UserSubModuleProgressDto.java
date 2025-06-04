package com.onboarding.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserSubModuleProgressDto {
    private String id;
    private String userId;
    private String submoduleId;
    private int completionPercentage;
    private String status;
    private LocalDateTime lastAccessedAt;
    private int videoProgress;
    private String contentProgress;
}