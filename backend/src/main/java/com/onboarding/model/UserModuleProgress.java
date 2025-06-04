package com.onboarding.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Data
@Document(collection = "userProgress") // Store all user progress in one collection
public class UserModuleProgress {

    @Id
    private String id;

    @DBRef
    private User user;

    @DBRef
    private Module module;

    private int completionPercentage; // Overall module completion
    private String status; // e.g., Not Started, In Progress, Completed
    private LocalDateTime lastAccessedAt;

    // Identifier to distinguish module progress from submodule progress in the same
    // collection
    private String progressType = "module";

}