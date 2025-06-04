package com.onboarding.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "progress")
public class Progress {
    @Id
    private String id;
    private String userId;
    private String moduleId;
    private String status; // "completed", "in-progress", "not-started"
    private int completedSubModules;
    private int totalSubModules;
    private int quizScore;
    private String lastAccessedAt;
    private String completedAt;
    private LocalDateTime lastActivity;
}