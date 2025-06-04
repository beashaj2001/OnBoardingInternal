package com.onboarding.service.impl;

import com.onboarding.dto.UserModuleProgressDto;
import com.onboarding.dto.UserSubModuleProgressDto;
import com.onboarding.model.UserModuleProgress;
import com.onboarding.model.UserSubModuleProgress;
import com.onboarding.model.User;
import com.onboarding.model.Module;
import com.onboarding.model.SubModule;
import com.onboarding.model.UserProgress;
import com.onboarding.repository.UserModuleProgressRepository;
import com.onboarding.repository.UserSubModuleProgressRepository;
import com.onboarding.repository.UserRepository;
import com.onboarding.repository.ModuleRepository;
import com.onboarding.repository.SubModuleRepository;
import com.onboarding.service.UserProgressService;
import com.onboarding.repository.UserProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserProgressServiceImpl implements UserProgressService {

    private final UserModuleProgressRepository userModuleProgressRepository;
    private final UserSubModuleProgressRepository userSubModuleProgressRepository;
    private final UserRepository userRepository;
    private final ModuleRepository moduleRepository;
    private final SubModuleRepository subModuleRepository;
    private final UserProgressRepository userProgressRepository;

    @Autowired
    public UserProgressServiceImpl(
            UserModuleProgressRepository userModuleProgressRepository,
            UserSubModuleProgressRepository userSubModuleProgressRepository,
            UserRepository userRepository,
            ModuleRepository moduleRepository,
            SubModuleRepository subModuleRepository,
            UserProgressRepository userProgressRepository) {
        this.userModuleProgressRepository = userModuleProgressRepository;
        this.userSubModuleProgressRepository = userSubModuleProgressRepository;
        this.userRepository = userRepository;
        this.moduleRepository = moduleRepository;
        this.subModuleRepository = subModuleRepository;
        this.userProgressRepository = userProgressRepository;
    }

    @Override
    public UserModuleProgressDto getUserModuleProgress(String userId, String moduleId) {
        Optional<UserModuleProgress> progress = userModuleProgressRepository.findByUser_IdAndModule_Id(userId,
                moduleId);
        return progress.map(this::convertToDto).orElse(null);
    }

    @Override
    public UserSubModuleProgressDto getUserSubModuleProgress(String userId, String submoduleId) {
        Optional<UserSubModuleProgress> progress = userSubModuleProgressRepository.findByUser_IdAndSubModule_Id(userId,
                submoduleId);
        return progress.map(this::convertToDto).orElse(null);
    }

    @Override
    public List<UserSubModuleProgressDto> getUserSubModuleProgressByModule(String userId, String moduleId) {
        List<UserSubModuleProgress> progressList = userSubModuleProgressRepository
                .findByUser_IdAndSubModule_Module_Id(userId, moduleId);
        return progressList.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserModuleProgressDto saveUserModuleProgress(UserModuleProgressDto progressDto) {
        // Find existing progress or create a new one
        UserModuleProgress progress = userModuleProgressRepository
                .findByUser_IdAndModule_Id(progressDto.getUserId(), progressDto.getModuleId())
                .orElse(new UserModuleProgress());

        // Fetch User and Module entities
        User user = userRepository.findById(progressDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Module module = moduleRepository.findById(progressDto.getModuleId())
                .orElseThrow(() -> new RuntimeException("Module not found"));

        // Update or set fields
        progress.setUser(user);
        progress.setModule(module);
        progress.setCompletionPercentage(progressDto.getCompletionPercentage());
        progress.setStatus(progressDto.getStatus());
        progress.setLastAccessedAt(
                progressDto.getLastAccessedAt() != null ? progressDto.getLastAccessedAt() : LocalDateTime.now());

        // Set progressType for new entities (should be done in convertToEntity ideally,
        // but doing here for clarity)
        if (progress.getId() == null) {
            progress.setProgressType("module");
        }

        // Save and convert back to DTO
        UserModuleProgress savedProgress = userModuleProgressRepository.save(progress);
        return convertToDto(savedProgress);
    }

    @Override
    @Transactional
    public UserSubModuleProgressDto saveUserSubModuleProgress(UserSubModuleProgressDto progressDto) {
        // Find existing progress or create a new one
        UserSubModuleProgress progress = userSubModuleProgressRepository
                .findByUser_IdAndSubModule_Id(progressDto.getUserId(), progressDto.getSubmoduleId())
                .orElse(new UserSubModuleProgress());

        // Fetch User and SubModule entities
        User user = userRepository.findById(progressDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        SubModule subModule = subModuleRepository.findById(progressDto.getSubmoduleId())
                .orElseThrow(() -> new RuntimeException("SubModule not found"));

        // Update or set fields
        progress.setUser(user);
        progress.setSubModule(subModule);
        progress.setCompletionPercentage(progressDto.getCompletionPercentage());
        progress.setStatus(progressDto.getStatus());
        progress.setLastAccessedAt(
                progressDto.getLastAccessedAt() != null ? progressDto.getLastAccessedAt() : LocalDateTime.now());
        progress.setVideoProgress(progressDto.getVideoProgress());
        progress.setContentProgress(progressDto.getContentProgress());

        // Set progressType for new entities
        if (progress.getId() == null) {
            progress.setProgressType("submodule");
        }

        // Save and convert back to DTO
        UserSubModuleProgress savedProgress = userSubModuleProgressRepository.save(progress);
        return convertToDto(savedProgress);
    }

    @Override
    @Transactional
    public void calculateAndSaveModuleProgress(String userId, String moduleId) {
        // Fetch all submodule progress for the user and module
        List<UserSubModuleProgress> submoduleProgressList = userSubModuleProgressRepository
                .findByUser_IdAndSubModule_Module_Id(userId, moduleId);

        if (submoduleProgressList.isEmpty()) {
            // If no submodule progress, module progress is 0%
            saveOrUpdateModuleProgress(userId, moduleId, 0, "Not Started");
            return;
        }

        // Fetch the module to get the total number of submodules
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        int totalSubmodules = module.getSubModules() != null ? module.getSubModules().size() : 0;
        int completedSubmodules = 0;
        int totalPercentage = 0;

        for (UserSubModuleProgress submoduleProgress : submoduleProgressList) {
            if (submoduleProgress.getCompletionPercentage() == 100) {
                completedSubmodules++;
            }
            totalPercentage += submoduleProgress.getCompletionPercentage();
        }

        int overallCompletionPercentage = 0;
        String status = "Not Started";

        if (totalSubmodules > 0) {
            // Calculate overall percentage based on completed submodules (can adjust logic
            // as needed)
            overallCompletionPercentage = (int) Math.round(((double) completedSubmodules / totalSubmodules) * 100);

            // Determine status
            if (completedSubmodules == totalSubmodules) {
                status = "Completed";
            } else if (completedSubmodules > 0) {
                status = "In Progress";
            }
        } else if (!submoduleProgressList.isEmpty()) {
            // Edge case: module has no submodules but there's some progress data (shouldn't
            // happen with current schema, but for safety)
            overallCompletionPercentage = 100; // Or some default
            status = "Completed"; // Or some default
        }

        // Save or update the main module progress
        saveOrUpdateModuleProgress(userId, moduleId, overallCompletionPercentage, status);
    }

    // Helper method to save or update UserModuleProgress
    private void saveOrUpdateModuleProgress(String userId, String moduleId, int completionPercentage, String status) {
        UserModuleProgress moduleProgress = userModuleProgressRepository.findByUser_IdAndModule_Id(userId, moduleId)
                .orElse(new UserModuleProgress());

        // Fetch User and Module entities
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        moduleProgress.setUser(user);
        moduleProgress.setModule(module);
        moduleProgress.setCompletionPercentage(completionPercentage);
        moduleProgress.setStatus(status);
        moduleProgress.setLastAccessedAt(LocalDateTime.now());
        if (moduleProgress.getId() == null) {
            moduleProgress.setProgressType("module");
        }
        userModuleProgressRepository.save(moduleProgress);
    }

    // Helper method to convert UserModuleProgress entity to DTO
    private UserModuleProgressDto convertToDto(UserModuleProgress entity) {
        if (entity == null)
            return null;
        UserModuleProgressDto dto = new UserModuleProgressDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser() != null ? entity.getUser().getId() : null);
        dto.setModuleId(entity.getModule() != null ? entity.getModule().getId() : null);
        dto.setCompletionPercentage(entity.getCompletionPercentage());
        dto.setStatus(entity.getStatus());
        dto.setLastAccessedAt(entity.getLastAccessedAt());
        return dto;
    }

    // Helper method to convert UserSubModuleProgress entity to DTO
    private UserSubModuleProgressDto convertToDto(UserSubModuleProgress entity) {
        if (entity == null)
            return null;
        UserSubModuleProgressDto dto = new UserSubModuleProgressDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser() != null ? entity.getUser().getId() : null);
        dto.setSubmoduleId(entity.getSubModule() != null ? entity.getSubModule().getId() : null);
        dto.setCompletionPercentage(entity.getCompletionPercentage());
        dto.setStatus(entity.getStatus());
        // dto.setLastAccessedAt(entity.getLastAccessedAt() != null ?
        // entity.getLastAccessedAt().toString() : null);
        dto.setLastAccessedAt(entity.getLastAccessedAt());
        dto.setVideoProgress(entity.getVideoProgress());
        dto.setContentProgress(entity.getContentProgress());
        return dto;
    }

    // Helper method to convert UserModuleProgressDto to entity
    private UserModuleProgress convertToEntity(UserModuleProgressDto dto) {
        if (dto == null)
            return null;
        UserModuleProgress entity = new UserModuleProgress();
        entity.setId(dto.getId());
        // Need to fetch User and Module entities based on IDs in DTO
        // entity.setUser(userRepository.findById(dto.getUserId()).orElse(null));
        // entity.setModule(moduleRepository.findById(dto.getModuleId()).orElse(null));
        entity.setCompletionPercentage(dto.getCompletionPercentage());
        entity.setStatus(dto.getStatus());
        entity.setLastAccessedAt(dto.getLastAccessedAt());
        return entity;
    }

    // Helper method to convert UserSubModuleProgressDto to entity
    private UserSubModuleProgress convertToEntity(UserSubModuleProgressDto dto) {
        if (dto == null)
            return null;
        UserSubModuleProgress entity = new UserSubModuleProgress();
        entity.setId(dto.getId());
        // Need to fetch User and SubModule entities based on IDs in DTO
        // entity.setUser(userRepository.findById(dto.getUserId()).orElse(null));
        // entity.setSubModule(subModuleRepository.findById(dto.getSubmoduleId()).orElse(null));
        entity.setCompletionPercentage(dto.getCompletionPercentage());
        entity.setStatus(dto.getStatus());
        entity.setLastAccessedAt(dto.getLastAccessedAt());
        entity.setVideoProgress(dto.getVideoProgress());
        entity.setContentProgress(dto.getContentProgress());
        return entity;
    }

    @Override
    public List<UserModuleProgressDto> getUserModuleProgressByUserId(String userId) {
        List<UserModuleProgress> progressList = userModuleProgressRepository.findByUser_Id(userId);
        return progressList.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserSubModuleProgressDto> getUserSubModuleProgressByUserId(String userId) {
        List<UserSubModuleProgress> progressList = userSubModuleProgressRepository.findByUser_Id(userId);
        return progressList.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserProgress> getAllUserProgress() {
        // Fetch all user progress entries from the repository
        return userProgressRepository.findAll();
    }
}