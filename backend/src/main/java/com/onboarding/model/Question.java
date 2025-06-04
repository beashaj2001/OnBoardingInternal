package com.onboarding.model;

import lombok.Data;

import java.util.List;

@Data
public class Question {
    private String questionText;
    private List<String> options;
    private String correctAnswer;
    // Optional: Add a question type field if different types of questions are
    // needed
}