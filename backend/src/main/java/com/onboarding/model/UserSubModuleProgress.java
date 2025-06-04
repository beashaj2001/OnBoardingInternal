package com.onboarding.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Data
@Document(collection = "userProgress") // Store all user progress in one collection
public class UserSubModuleProgress {

    @Id
    private String id;

    @DBRef
    private User user;

    @DBRef
    private SubModule subModule;

    private int completionPercentage; // Submodule completion
    private String status; // e.g., Not Started, In Progress, Completed
    private LocalDateTime lastAccessedAt;
    private int videoProgress; // Specific progress for video submodules
    private String contentProgress; // Specific progress for text/other content types

    // Identifier to distinguish module progress from submodule progress in the same
    // collection
    private String progressType = "submodule";
}