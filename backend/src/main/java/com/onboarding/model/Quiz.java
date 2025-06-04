package com.onboarding.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "quizzes")
public class Quiz {
    @Id
    private String id;
    private String moduleId;
    private String title;
    private String description;
    private int timeLimit; // in minutes
    private int passingScore;
    private boolean isActive;
    private List<Question> questions; // List of quiz questions
    private boolean isEnabled = false; // Flag to enable/disable the quiz for trainees

    // Constructors
    public Quiz() {
    }

    public Quiz(String moduleId, String title, String description, int timeLimit, int passingScore, boolean isActive,
            List<Question> questions, boolean isEnabled) {
        this.moduleId = moduleId;
        this.title = title;
        this.description = description;
        this.timeLimit = timeLimit;
        this.passingScore = passingScore;
        this.isActive = isActive;
        this.questions = questions;
        this.isEnabled = isEnabled;
    }
}