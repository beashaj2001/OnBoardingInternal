package com.onboarding.service.impl;

import com.onboarding.dto.ProgressDTO;
import com.onboarding.model.UserProgress;
import com.onboarding.model.UserQuiz;
import com.onboarding.model.User;
import com.onboarding.model.Achievement;
import com.onboarding.model.Module;
import com.onboarding.model.Quiz;
import com.onboarding.model.SubModule;
import com.onboarding.repository.UserProgressRepository;
import com.onboarding.repository.UserQuizRepository;
import com.onboarding.repository.ModuleRepository;
import com.onboarding.repository.UserRepository;
import com.onboarding.repository.AchievementRepository;
import com.onboarding.repository.QuizRepository;
import com.onboarding.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProgressServiceImpl implements ProgressService {

    private final UserProgressRepository userProgressRepository;
    private final UserQuizRepository userQuizRepository;
    private final ModuleRepository moduleRepository;
    private final UserRepository userRepository;
    private final AchievementRepository achievementRepository;
    private final QuizRepository quizRepository;
    private final MongoTemplate mongoTemplate;

    @Autowired
    public ProgressServiceImpl(
            UserProgressRepository userProgressRepository,
            UserQuizRepository userQuizRepository,
            ModuleRepository moduleRepository,
            UserRepository userRepository,
            AchievementRepository achievementRepository,
            QuizRepository quizRepository,
            MongoTemplate mongoTemplate) {
        this.userProgressRepository = userProgressRepository;
        this.userQuizRepository = userQuizRepository;
        this.moduleRepository = moduleRepository;
        this.userRepository = userRepository;
        this.achievementRepository = achievementRepository;
        this.quizRepository = quizRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public ProgressDTO getTraineeProgress(String userId) {
        // Get all progress entries for the user
        List<UserProgress> progressEntries = userProgressRepository.findByUserId(userId);

        // Count modules by status
        int completed = 0;
        int inProgress = 0;
        int notStarted = 0;
        String lastActivity = null;

        for (UserProgress progress : progressEntries) {
            switch (progress.getStatus()) {
                case "COMPLETED":
                    completed++;
                    break;
                case "IN_PROGRESS":
                    inProgress++;
                    break;
                case "NOT_STARTED":
                    notStarted++;
                    break;
            }

            // Track last activity
            if (lastActivity == null || (progress.getLastAccessedAt() != null && progress.getLastAccessedAt()
                    .compareTo(LocalDateTime.parse(lastActivity, DateTimeFormatter.ISO_DATE_TIME)) > 0)) {
                lastActivity = progress.getLastAccessedAt().format(DateTimeFormatter.ISO_DATE_TIME);
            }
        }

        // Calculate average score from completed quizzes
        List<UserQuiz> userQuizzes = userQuizRepository.findByUserId(userId);
        int totalScore = 0;
        int completedQuizzes = 0;

        for (UserQuiz userQuiz : userQuizzes) {
            if (userQuiz.isCompleted()) {
                totalScore += userQuiz.getScore();
                completedQuizzes++;
            }
        }

        int averageScore = completedQuizzes > 0 ? totalScore / completedQuizzes : 0;

        return new ProgressDTO(
                completed,
                inProgress,
                notStarted,
                lastActivity != null ? lastActivity : LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
                averageScore);
    }

    @Override
    public ProgressDTO updateTraineeProgress(String userId, ProgressDTO ProgressDTO) {
        // This method would typically update the progress in the database
        // For now, we'll just return the updated DTO
        return ProgressDTO;
    }

    @Override
    @Transactional
    public void completeSubModule(String userId, String moduleId, String subModuleId) {
        UserProgress userProgress = userProgressRepository.findByUserIdAndModuleId(userId, moduleId)
                .orElse(new UserProgress(userId, moduleId, "NOT_STARTED", 0));

        // Add sub-module if not already completed
        if (!userProgress.getCompletedSubModuleIds().contains(subModuleId)) {
            userProgress.getCompletedSubModuleIds().add(subModuleId);
        }

        // Get module with submodules using MongoTemplate
        Query query = new Query(Criteria.where("id").is(moduleId));
        Module module = mongoTemplate.findOne(query, Module.class);
        if (module == null) {
            throw new RuntimeException("Module not found with id: " + moduleId);
        }

        // Load submodules explicitly
        List<SubModule> subModules = mongoTemplate.find(
                new Query(Criteria.where("module.$id").is(moduleId)),
                SubModule.class);
        module.setSubModules(subModules);

        if (subModules == null || subModules.isEmpty()) {
            throw new RuntimeException("No submodules found for module id: " + moduleId);
        }

        // Validate that the completed submodule exists in the module
        if (!subModules.stream().anyMatch(sub -> sub.getId().equals(subModuleId))) {
            throw new RuntimeException("Submodule " + subModuleId + " not found in module " + moduleId);
        }

        int totalSections = subModules.size();
        int completedSections = userProgress.getCompletedSubModuleIds().size();

        // Calculate completion percentage including quiz if applicable
        int totalItems = totalSections;
        int completedItems = completedSections;

        boolean includeQuizInCompletion = module.getQuizId() != null
                && ("MANDATORY".equals(module.getCompletionMode())
                        || "SELF_LEARNED".equals(module.getCompletionMode()));

        if (includeQuizInCompletion) {
            totalItems++; // Add quiz to total items
            UserQuiz userQuiz = userQuizRepository.findByUserIdAndQuizId(userId, module.getQuizId()).orElse(null);
            if (userQuiz != null && userQuiz.isCompleted()) {
                completedItems++; // Add completed quiz to completed items
            }
        }

        int completionPercentage = totalItems > 0 ? (completedItems * 100) / totalItems : 0;

        userProgress.setCompletionPercentage(completionPercentage);
        userProgress.setLastAccessedAt(LocalDateTime.now());

        // Update status based on completion percentage
        if (completionPercentage == 100) {
            userProgress.setStatus("COMPLETED");
            userProgress.setCompletedAt(LocalDateTime.now());
        } else if (completionPercentage > 0) {
            userProgress.setStatus("IN_PROGRESS");
        } else {
            userProgress.setStatus("NOT_STARTED");
        }

        userProgressRepository.save(userProgress);

        // Add log to check the saved userProgress object
        System.out.println("Saved UserProgress object: " + userProgress.toString());

        // Re-check for Mandatory and Self Learned Modules Completion badges after
        // updating progress
        checkAndAwardModuleCompletionBadges(userId, moduleId, userProgress.getStatus());
    }

    // Extracted badge logic to a separate method to be called from here and
    // submitQuiz
    private void checkAndAwardModuleCompletionBadges(String userId, String moduleId, String moduleStatus) {
        if ("COMPLETED".equals(moduleStatus)) {
            // Check for Mandatory Modules Completion badge
            Set<String> mandatoryModuleIds = moduleRepository.findByIsMandatoryTrue().stream()
                    .map(module -> module.getId())
                    .collect(Collectors.toSet());

            Set<String> userCompletedModuleIds = userProgressRepository.findByUserId(userId).stream()
                    .filter(progress -> "COMPLETED".equals(progress.getStatus()))
                    .map(UserProgress::getModuleId)
                    .collect(Collectors.toSet());

            boolean allMandatoryCompleted = userCompletedModuleIds.containsAll(mandatoryModuleIds);

            if (allMandatoryCompleted) {
                userRepository.findById(userId).ifPresent(user -> {
                    String mandatoryBadgeId = "mandatory-completion";
                    if (!user.getEarnedAchievementIds().contains(mandatoryBadgeId)) {
                        user.getEarnedAchievementIds().add(mandatoryBadgeId);
                        user.setBadgesEarnedCount(user.getBadgesEarnedCount() + 1);
                        userRepository.save(user);
                    }
                });
            }

            // Check for Self Learned Modules Completion badge
            if (!moduleRepository.findById(moduleId).orElseThrow().isMandatory()) { // Check if the completed module is
                                                                                    // non-mandatory
                Set<String> nonMandatoryModuleIds = moduleRepository.findAll().stream()
                        .filter(module -> !module.isMandatory())
                        .map(module -> module.getId())
                        .collect(Collectors.toSet());

                Set<String> userCompletedNonMandatoryModuleIds = userProgressRepository.findByUserId(userId).stream()
                        .filter(progress -> "COMPLETED".equals(progress.getStatus()))
                        .map(UserProgress::getModuleId)
                        .filter(nonMandatoryModuleIds::contains)
                        .collect(Collectors.toSet());

                int selfLearnedThreshold = 3;

                if (userCompletedNonMandatoryModuleIds.size() >= selfLearnedThreshold) {
                    userRepository.findById(userId).ifPresent(user -> {
                        String selfLearnedBadgeId = "self-learned-completion";
                        if (!user.getEarnedAchievementIds().contains(selfLearnedBadgeId)) {
                            user.getEarnedAchievementIds().add(selfLearnedBadgeId);
                            user.setBadgesEarnedCount(user.getBadgesEarnedCount() + 1);
                            userRepository.save(user);
                        }
                    });
                }
            }
        }
    }
}