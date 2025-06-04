package com.onboarding.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String firstName;
    private String lastName;
    private String email;
    private String avatar;
    private String role; // "TRAINEE" or "TRAINER"
    private boolean enabled = true;
    private String createdAt;
    private String lastActive;
    private int badgesEarnedCount = 0;
    private List<String> earnedAchievementIds = new ArrayList<>();

    public User() {
    }

    public User(String username, String password, String firstName, String lastName, String email, String role) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public int getBadgesEarnedCount() {
        return badgesEarnedCount;
    }

    public void setBadgesEarnedCount(int badgesEarnedCount) {
        this.badgesEarnedCount = badgesEarnedCount;
    }

    public List<String> getEarnedAchievementIds() {
        return earnedAchievementIds;
    }

    public void setEarnedAchievementIds(List<String> earnedAchievementIds) {
        this.earnedAchievementIds = earnedAchievementIds;
    }
}