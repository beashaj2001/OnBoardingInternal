package com.onboarding.dto;

import lombok.Data;

@Data
public class AchievementDto {
    private String id;
    private String title;
    private String description;
    private String iconClass; // Identifier for the frontend icon

    // Constructors
    public AchievementDto() {
    }

    public AchievementDto(String id, String title, String description, String iconClass) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.iconClass = iconClass;
    }

}