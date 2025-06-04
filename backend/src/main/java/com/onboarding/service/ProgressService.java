package com.onboarding.service;

import com.onboarding.dto.ProgressDTO;
import com.onboarding.model.Progress;
import com.onboarding.repository.ProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service interface for managing trainee progress
 */
public interface ProgressService {
    /**
     * Get overall progress statistics for a trainee
     * 
     * @param userId the ID of the trainee
     * @return ProgressDTO containing completed, in-progress, and not-started module
     *         counts, last activity, and score
     */
    ProgressDTO getTraineeProgress(String userId);

    /**
     * Update progress for a trainee
     * 
     * @param userId      the ID of the trainee
     * @param progressDTO the updated progress data
     * @return the updated progress data
     */
    ProgressDTO updateTraineeProgress(String userId, ProgressDTO progressDTO);

    // Add a method to handle sub-module completion
    void completeSubModule(String userId, String moduleId, String subModuleId);

    // Consider methods for updating overall module progress based on sub-modules
    // and quiz
    // This might be handled internally by completeSubModule and submitQuiz in
    // QuizService
}