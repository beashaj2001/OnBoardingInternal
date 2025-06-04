package com.onboarding.dto;

import lombok.Data;

@Data
public class UserAnswerDTO {
    private String questionId; // Or question index, depending on how questions are identified
    private String selectedAnswer; // The answer chosen by the user
}