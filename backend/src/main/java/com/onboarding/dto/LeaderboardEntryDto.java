package com.onboarding.dto;

import lombok.Data;

@Data
public class LeaderboardEntryDto {
    private String id;
    private String name;
    private String avatar;
    private int points; // Or score, based on your calculation logic

    // Constructors
    public LeaderboardEntryDto() {
    }

    public LeaderboardEntryDto(String id, String name, String avatar, int points) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.points = points;
    }
}