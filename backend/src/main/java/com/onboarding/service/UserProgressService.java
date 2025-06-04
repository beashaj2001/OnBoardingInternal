package com.onboarding.service;

import com.onboarding.dto.UserModuleProgressDto;
import com.onboarding.dto.UserSubModuleProgressDto;
import com.onboarding.model.UserProgress;
import com.onboarding.repository.UserProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service interface for managing user progress on modules and submodules.
 */
public interface UserProgressService {

    /**
     * Get a user's progress for a specific module.
     *
     * @param userId   The ID of the user.
     * @param moduleId The ID of the module.
     * @return The user's module progress DTO, or null if not found.
     */
    UserModuleProgressDto getUserModuleProgress(String userId, String moduleId);

    /**
     * Get a user's progress for a specific submodule.
     *
     * @param userId      The ID of the user.
     * @param submoduleId The ID of the submodule.
     * @return The user's submodule progress DTO, or null if not found.
     */
    UserSubModuleProgressDto getUserSubModuleProgress(String userId, String submoduleId);

    /**
     * Get all submodule progress for a user within a specific module.
     *
     * @param userId   The ID of the user.
     * @param moduleId The ID of the module.
     * @return A list of user's submodule progress DTOs for the module.
     */
    List<UserSubModuleProgressDto> getUserSubModuleProgressByModule(String userId, String moduleId);

    /**
     * Create or update a user's module progress.
     *
     * @param progressDto The user module progress DTO to save.
     * @return The saved user module progress DTO.
     */
    UserModuleProgressDto saveUserModuleProgress(UserModuleProgressDto progressDto);

    /**
     * Create or update a user's submodule progress.
     *
     * @param progressDto The user submodule progress DTO to save.
     * @return The saved user submodule progress DTO.
     */
    UserSubModuleProgressDto saveUserSubModuleProgress(UserSubModuleProgressDto progressDto);

    /**
     * Calculate and save the overall module progress based on the user's submodule
     * progress within that module.
     *
     * @param userId   The ID of the user.
     * @param moduleId The ID of the module.
     */
    void calculateAndSaveModuleProgress(String userId, String moduleId);

    /**
     * Get all module progress entries for a specific user.
     *
     * @param userId The ID of the user.
     * @return A list of user's module progress DTOs.
     */
    List<UserModuleProgressDto> getUserModuleProgressByUserId(String userId);

    /**
     * Get all submodule progress entries for a specific user.
     *
     * @param userId The ID of the user.
     * @return A list of user's submodule progress DTOs.
     */
    List<UserSubModuleProgressDto> getUserSubModuleProgressByUserId(String userId);

    /**
     * Get all user progress entries.
     *
     * @return A list of all user progress entries.
     */
    List<UserProgress> getAllUserProgress();
}