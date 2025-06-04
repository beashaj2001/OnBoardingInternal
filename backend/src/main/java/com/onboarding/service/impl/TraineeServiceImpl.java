package com.onboarding.service.impl;

import com.onboarding.dto.AchievementDto;
import com.onboarding.dto.LeaderboardEntryDto;
import com.onboarding.dto.ModuleDTO;
import com.onboarding.dto.TraineeStatsDto;
import com.onboarding.model.*;
import com.onboarding.repository.*;
import com.onboarding.service.TraineeService;
import com.onboarding.service.UserProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TraineeServiceImpl implements TraineeService {

    private final UserRepository userRepository;
    private final UserProgressRepository userProgressRepository;
    private final QuizRepository quizRepository;
    private final UserQuizRepository userQuizRepository;
    private final ModuleRepository moduleRepository;
    private final AchievementRepository achievementRepository;
    private final UserProgressService userProgressService;

    // Constants for scoring
    private static final int POINTS_PER_COMPLETED_MODULE = 50;
    private static final int MAX_QUIZ_POINTS = 50;

    @Autowired
    public TraineeServiceImpl(
            UserRepository userRepository,
            UserProgressRepository userProgressRepository,
            QuizRepository quizRepository,
            UserQuizRepository userQuizRepository,
            ModuleRepository moduleRepository,
            AchievementRepository achievementRepository,
            UserProgressService userProgressService) {
        this.userRepository = userRepository;
        this.userProgressRepository = userProgressRepository;
        this.quizRepository = quizRepository;
        this.userQuizRepository = userQuizRepository;
        this.moduleRepository = moduleRepository;
        this.achievementRepository = achievementRepository;
        this.userProgressService = userProgressService;
    }

    @Override
    public TraineeStatsDto getTraineeStats(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            // Handle user not found, perhaps throw a custom exception
            // For now, returning default stats or null/empty DTO
            // Ensure the constructor call here also matches the DTO if a default name is
            // needed
            return new TraineeStatsDto("Guest", 0, 0, 0, 0, 0, 0, 0); // Assuming a default constructor or handling
        }

        User trainee = userOptional.get();

        // Log user's name to check if it's being retrieved correctly
        System.out.println("Fetching stats for user: " + trainee.getFirstName() + " " + trainee.getLastName());

        // Get badges earned count from User entity
        int badgesEarned = trainee.getBadgesEarnedCount();
        System.out.println("Badges Earned: " + badgesEarned);

        // Count total modules (assuming all modules are relevant for a trainee's
        // overall stats context)
        long totalModules = moduleRepository.count();
        System.out.println("Total Modules: " + totalModules);

        // Count completed modules from UserProgress
        long completedModules = userProgressRepository.countByUserIdAndStatus(userId, "COMPLETED");
        System.out.println("Completed Modules: " + completedModules);

        // Calculate overall progress as percentage of completed modules out of total
        // modules
        int overallProgress = (int) (totalModules > 0 ? (completedModules * 100 / totalModules) : 0);

        // Count completed quizzes
        long completedQuizzes = userQuizRepository.countByUserIdAndCompleted(userId, true);
        System.out.println("Completed Quizzes (Assessments): " + completedQuizzes);

        // For total badges, we'll use a placeholder for now until we define badges more
        // formally
        // Or this could be the total count of 'achievement' types that grant badges
        int totalBadges = 12; // Placeholder value

        // Fetch all modules
        List<com.onboarding.model.Module> allModules = moduleRepository.findAll();

        // Fetch user's progress for all modules
        List<UserProgress> userProgress = userProgressRepository.findByUserId(userId);

        // Create a map of module progress for quick lookup
        Map<String, UserProgress> progressMap = userProgress.stream()
                .collect(Collectors.toMap(UserProgress::getModuleId, progress -> progress,
                        (existing, replacement) -> existing)); // Handle duplicate keys

        // Calculate module counts by status
        long completedModulesCount = allModules.stream()
                .filter(module -> {
                    UserProgress progress = progressMap.get(module.getId());
                    return progress != null && "COMPLETED".equals(progress.getStatus());
                })
                .count();

        long inProgressModulesCount = allModules.stream()
                .filter(module -> {
                    UserProgress progress = progressMap.get(module.getId());
                    return progress != null && "IN_PROGRESS".equals(progress.getStatus());
                })
                .count();

        long notStartedModulesCount = allModules.size() - completedModulesCount - inProgressModulesCount;

        // Include the user's name and module counts in the DTO
        return new TraineeStatsDto(
                trainee.getFirstName() + " " + trainee.getLastName(),
                overallProgress,
                badgesEarned,
                totalBadges,
                (int) completedQuizzes,
                (int) completedModulesCount,
                (int) inProgressModulesCount,
                (int) notStartedModulesCount);
    }

    @Override
    public List<AchievementDto> getTraineeAchievements(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            // Handle user not found
            return List.of(); // Return empty list if user not found
        }

        User trainee = userOptional.get();
        List<String> earnedAchievementIds = trainee.getEarnedAchievementIds();

        if (earnedAchievementIds == null || earnedAchievementIds.isEmpty()) {
            return List.of(); // Return empty list if no achievements earned
        }

        // Fetch achievements by their IDs
        List<Achievement> achievements = achievementRepository.findAllById(earnedAchievementIds);

        // Convert Achievement entities to AchievementDto
        return achievements.stream()
                .map(achievement -> new AchievementDto(
                        achievement.getId(),
                        achievement.getTitle(),
                        achievement.getDescription(),
                        achievement.getIconClass()))
                .collect(Collectors.toList());
    }

    @Override
    public List<LeaderboardEntryDto> getLeaderboardData() {
        // Get all trainees (users with role TRAINEE)
        List<User> trainees = userRepository.findByRole("TRAINEE");

        // Get all mandatory modules
        List<com.onboarding.model.Module> mandatoryModules = moduleRepository.findByIsMandatoryTrue();

        // Calculate scores for each trainee
        List<LeaderboardEntryDto> leaderboardEntries = trainees.stream()
                .map(trainee -> calculateTraineeScore(trainee, mandatoryModules))
                .filter(Objects::nonNull)
                .sorted(Comparator.comparingInt(LeaderboardEntryDto::getPoints).reversed())
                .collect(Collectors.toList());

        return leaderboardEntries;
    }

    private LeaderboardEntryDto calculateTraineeScore(User trainee,
            List<com.onboarding.model.Module> mandatoryModules) {
        String userId = trainee.getId();

        // Get all progress entries for this trainee
        List<UserProgress> progressEntries = userProgressRepository.findByUserId(userId);
        Map<String, UserProgress> progressMap = progressEntries.stream()
                .collect(Collectors.toMap(UserProgress::getModuleId, progress -> progress));

        // Get all quiz entries for this trainee
        List<UserQuiz> userQuizEntries = userQuizRepository.findByUserId(userId);
        Map<String, UserQuiz> quizMap = userQuizEntries.stream()
                .collect(Collectors.toMap(UserQuiz::getQuizId, quiz -> quiz));

        // Get all modules and their quizzes
        List<com.onboarding.model.Module> allModules = moduleRepository.findAll();
        Map<String, Quiz> moduleQuizMap = quizRepository.findAll().stream()
                .collect(Collectors.toMap(Quiz::getModuleId, quiz -> quiz));

        int totalPoints = 0;

        for (com.onboarding.model.Module module : allModules) {
            String moduleId = module.getId();
            UserProgress progress = progressMap.get(moduleId);

            // Skip if module is not mandatory or self-learned
            if (!"MANDATORY".equals(module.getCompletionMode()) && !"SELF_LEARNED".equals(module.getCompletionMode())) {
                continue;
            }

            // Add points for completed module
            if (progress != null && "COMPLETED".equals(progress.getStatus())) {
                totalPoints += POINTS_PER_COMPLETED_MODULE;
            }

            // Add points for completed quiz
            Quiz moduleQuiz = moduleQuizMap.get(moduleId);
            if (moduleQuiz != null) {
                UserQuiz userQuiz = quizMap.get(moduleQuiz.getId());
                if (userQuiz != null && userQuiz.isCompleted()) {
                    double scorePercentage = (double) userQuiz.getScore() / userQuiz.getMaxScore();
                    totalPoints += (int) (MAX_QUIZ_POINTS * scorePercentage);
                }
            }
        }

        return new LeaderboardEntryDto(
                trainee.getId(),
                trainee.getFirstName() + " " + trainee.getLastName(),
                trainee.getAvatar(),
                totalPoints);
    }

    @Override
    public List<ModuleDTO> getTraineeModules(String userId) {
        // Get all modules
        List<com.onboarding.model.Module> allModules = moduleRepository.findAll();

        // Get user's progress for all modules
        List<UserProgress> userProgress = userProgressRepository.findByUserId(userId);

        // Get all quizzes
        List<Quiz> allQuizzes = quizRepository.findAll();

        // Get user's quiz completions
        List<UserQuiz> userQuizzes = userQuizRepository.findByUserId(userId);

        // Create a map of module progress for quick lookup
        Map<String, UserProgress> progressMap = userProgress.stream()
                .collect(Collectors.toMap(UserProgress::getModuleId, progress -> progress,
                        (existing, replacement) -> existing)); // Handle duplicate keys

        // Create a map of module quizzes for quick lookup
        Map<String, Quiz> quizMap = allQuizzes.stream()
                .collect(Collectors.toMap(Quiz::getModuleId, quiz -> quiz, (existing, replacement) -> existing));

        // Create a map of user's quiz completions for quick lookup
        Map<String, UserQuiz> userQuizMap = userQuizzes.stream()
                .collect(Collectors.toMap(UserQuiz::getQuizId, userQuiz -> userQuiz));

        // Convert modules to DTOs with progress information
        List<ModuleDTO> moduleDTOs = allModules.stream()
                .map(module -> {
                    ModuleDTO dto = new ModuleDTO(); // Use no-arg constructor

                    // Set basic module information
                    dto.setId(module.getId());
                    dto.setTitle(module.getTitle() != null ? module.getTitle() : "");
                    dto.setDescription(module.getDescription() != null ? module.getDescription() : "");
                    dto.setDuration(module.getDuration() != null ? module.getDuration() : "");
                    dto.setImage(module.getImage() != null ? module.getImage() : "");
                    dto.setType(module.getType() != null ? module.getType() : "text");
                    dto.setMandatory(module.isMandatory());
                    dto.setOrder(module.getOrder());
                    dto.setActive(module.isActive());
                    dto.setCompletionMode(module.getCompletionMode() != null ? module.getCompletionMode() : "");

                    // Add user progress information
                    UserProgress progress = progressMap.get(module.getId());

                    // Add log to check UserProgress and completionPercentage
                    System.out.println("Processing module: " + module.getId() + ", UserProgress found: "
                            + (progress != null) + ", Completion Percentage in UserProgress: "
                            + (progress != null ? progress.getCompletionPercentage() : "N/A"));

                    if (progress != null) {
                        dto.setUserProgressId(progress.getId());
                        dto.setCompletionPercentage(progress.getCompletionPercentage()); // Set completion percentage
                        dto.setStatus(progress.getStatus() != null ? progress.getStatus() : "");
                        dto.setLastAccessedAt(
                                progress.getLastAccessedAt() != null ? progress.getLastAccessedAt().toString() : null);
                    } else {
                        // Default values if no user progress entry exists
                        dto.setUserProgressId(null);
                        dto.setCompletionPercentage(0);
                        dto.setStatus("NOT_STARTED");
                        dto.setLastAccessedAt(null);
                    }

                    // Add quiz information
                    Quiz quiz = quizMap.get(module.getId());
                    dto.setHasAssessment(false); // Default to false
                    if (quiz != null) {
                        dto.setHasAssessment(true);
                        dto.setQuizId(quiz.getId()); // Set quizId
                        UserQuiz userQuiz = userQuizMap.get(quiz.getId());
                        if (userQuiz != null) {
                            dto.setAssessmentCompleted(userQuiz.isCompleted());
                            dto.setAssessmentScore(userQuiz.getScore());
                        } else {
                            // Default assessment progress if quiz exists but no user quiz entry
                            dto.setAssessmentCompleted(false);
                            dto.setAssessmentScore(null);
                        }
                    } else { // If no quiz for the module
                        dto.setQuizId(null);
                        dto.setHasAssessment(false);
                        dto.setAssessmentCompleted(false);
                        dto.setAssessmentScore(null);
                    }

                    return dto;
                })
                .sorted(Comparator.comparing(ModuleDTO::isMandatory).reversed()
                        .thenComparing(dto -> {
                            // Custom sorting for non-mandatory modules: In Progress/Completed before Not
                            // Started
                            if (dto.isMandatory())
                                return 0; // Mandatory modules stay at the top
                            if ("IN_PROGRESS".equals(dto.getStatus()) || "COMPLETED".equals(dto.getStatus()))
                                return 1; // Self-learned
                            return 2; // Not started non-mandatory
                        })
                        .thenComparingInt(ModuleDTO::getOrder)) // Maintain order within groups
                .collect(Collectors.toList());

        // Manually add the Introduction module DTO
        ModuleDTO introDto = new ModuleDTO();
        introDto.setId("introduction_module"); // Unique ID
        introDto.setTitle("Introduction");
        introDto.setDescription("Learn about our company vision and mission."); // Add a description
        introDto.setDuration("5 mins");
        introDto.setImage(null); // Or a specific image URL if available
        introDto.setType("text"); // Assuming it's a text-based module
        introDto.setMandatory(true); // Assuming it's mandatory
        introDto.setOrder(0); // Make it the first module
        introDto.setActive(true);
        introDto.setCompletionMode("MANDATORY"); // Or another appropriate mode

        // Default user progress information for the Introduction module (not started)
        introDto.setUserProgressId(null);
        introDto.setCompletionPercentage(0);
        introDto.setStatus("NOT_STARTED");
        introDto.setLastAccessedAt(null);

        // No quiz for the introduction module
        introDto.setHasAssessment(false);
        introDto.setQuizId(null);
        introDto.setAssessmentCompleted(false);
        introDto.setAssessmentScore(null);

        // Add the introduction module to the beginning of the list
        List<ModuleDTO> finalModuleDTOs = new ArrayList<>();
        finalModuleDTOs.add(introDto);
        finalModuleDTOs.addAll(moduleDTOs);

        // Add log to check the final list of ModuleDTOs
        System.out.println("Returning ModuleDTOs:");
        allModules.stream().forEach(module -> {
            ModuleDTO dto = new ModuleDTO(); // Need to recreate DTO as stream is consumed
            UserProgress progress = progressMap.get(module.getId());
            String completionPercentage = (progress != null) ? String.valueOf(progress.getCompletionPercentage())
                    : "N/A";
            System.out
                    .println("  Module: " + module.getId() + ", Completion Percentage in DTO: " + completionPercentage);
        });

        return finalModuleDTOs;
    }
}