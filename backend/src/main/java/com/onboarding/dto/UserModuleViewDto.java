package com.onboarding.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserModuleViewDto {
    private String id;
    private String title;
    private String type;
    private String image;
    private String description;
    private String duration;
    private String displayTag;
    private String completionMode;

    // User Progress Fields
    private String userProgressId;
    private int completionPercentage; // Overall module completion for the user
    private String status; // User's status for the module
    private String lastAccessedAt; // Using String for simplicity, consider LocalDateTime if needed on frontend

    private List<UserSubModuleViewDto> subModules; // Submodules with user progress
}