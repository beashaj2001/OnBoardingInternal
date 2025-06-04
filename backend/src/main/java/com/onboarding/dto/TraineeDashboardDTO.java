package com.onboarding.dto;

import lombok.Data;

@Data
public class TraineeDashboardDTO {
    private String id;
    private String name;
    private String email;
    private String avatar;
    private int progress;
    private int completedModules;
    private int totalModules;
    private String lastActive;
}