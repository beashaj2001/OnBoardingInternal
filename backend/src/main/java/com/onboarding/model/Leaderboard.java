package com.onboarding.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "leaderboard")
public class Leaderboard {
    @Id
    private String id;
    private String userId;
    private String userName;
    private int score;
    private int completedModules;
    private int totalModules;
    private String lastUpdatedAt;
    private int rank;
    private LocalDateTime lastUpdated;
}