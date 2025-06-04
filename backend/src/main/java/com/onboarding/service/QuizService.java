package com.onboarding.service;

import com.onboarding.dto.QuizDTO;
import com.onboarding.dto.QuizSubmissionDTO;
import com.onboarding.model.Quiz;

import java.util.List;

public interface QuizService {
    List<QuizDTO> getAllQuizzes();

    QuizDTO getQuizById(String id);

    List<QuizDTO> getQuizzesByModuleId(String moduleId);

    QuizDTO createQuiz(QuizDTO quizDTO);

    QuizDTO updateQuiz(String id, QuizDTO quizDTO);

    void deleteQuiz(String id);

    int submitQuiz(String userId, QuizSubmissionDTO submissionDTO);
}