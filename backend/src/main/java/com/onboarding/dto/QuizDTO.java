package com.onboarding.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class QuizDTO {
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Module ID is required")
    private String moduleId;

    @NotEmpty(message = "At least one question is required")
    private List<QuestionDTO> questions;

    private int timeLimit; // in minutes
    private int passingScore;
    private boolean isActive;
}