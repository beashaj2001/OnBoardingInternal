package com.onboarding.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuizSubmissionDTO {
    private String quizId;
    private List<UserAnswerDTO> userAnswers;
}