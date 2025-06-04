package com.onboarding.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserSubModuleViewDto {
    private String id;
    private String title;
    private String type;
    private String duration;
    private String videoUrl;
    private String thumbnail;
    private List<ResourceDto> resources;

    // User Progress Fields
    private String userProgressId;
    private int completionPercentage; // Submodule completion for the user
    private String status; // User's status for the submodule
    private String lastAccessedAt; // Using String for simplicity
    private int videoProgress; // Specific progress for video submodules
    private String contentProgress; // Specific progress for text/other content types
}