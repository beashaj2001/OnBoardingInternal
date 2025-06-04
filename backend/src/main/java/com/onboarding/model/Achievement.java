package com.onboarding.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "achievements")
public class Achievement {
    @Id
    private String id;
    private String title;
    private String description;
    private String iconClass; // Stores identifier for frontend icon

    // Constructors, Getters, and Setters

    public Achievement() {
    }

    public Achievement(String title, String description, String iconClass) {
        this.title = title;
        this.description = description;
        this.iconClass = iconClass;
    }
}