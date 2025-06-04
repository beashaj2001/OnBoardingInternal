package com.onboarding.service;

import com.onboarding.dto.TrainerDashboardStatsDTO;
import com.onboarding.dto.TraineeDashboardDTO;
import com.onboarding.model.User;
import com.onboarding.model.UserProgress;
import com.onboarding.repository.UserRepository;
import com.onboarding.repository.ModuleRepository;
import com.onboarding.repository.UserQuizRepository;
import com.onboarding.repository.UserProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TrainerDashboardService {

    private final UserRepository userRepository;
    private final ModuleRepository moduleRepository;
    private final UserQuizRepository userQuizRepository;
    private final UserProgressRepository userProgressRepository;

    @Autowired
    public TrainerDashboardService(
            UserRepository userRepository,
            ModuleRepository moduleRepository,
            UserQuizRepository userQuizRepository,
            UserProgressRepository userProgressRepository) {
        this.userRepository = userRepository;
        this.moduleRepository = moduleRepository;
        this.userQuizRepository = userQuizRepository;
        this.userProgressRepository = userProgressRepository;
    }

    public TrainerDashboardStatsDTO getTrainerDashboardStats() {
        long activeTraineesCount = userRepository.countByRole("TRAINEE");
        long activeModulesCount = moduleRepository.count();
        long totalAssessmentsCount = userQuizRepository.countByCompleted(true);

        // Calculate average completion percentage (basic approach)
        List<UserProgress> allUserProgress = userProgressRepository.findAll();
        double averageCompletionPercentage = allUserProgress.stream()
                .mapToDouble(UserProgress::getCompletionPercentage)
                .average()
                .orElse(0.0);

        TrainerDashboardStatsDTO stats = new TrainerDashboardStatsDTO();
        stats.setActiveTraineesCount(activeTraineesCount);
        stats.setActiveModulesCount(activeModulesCount);
        stats.setAverageCompletionPercentage(averageCompletionPercentage);
        stats.setTotalAssessmentsCount(totalAssessmentsCount);

        return stats;
    }

    public List<TraineeDashboardDTO> getRecentTrainees(int limit) {
        // Fetch recent trainee users (assuming User model has lastActive field)
        Pageable pageable = PageRequest.of(0, limit);
        List<User> recentTraineeUsers = userRepository.findByRoleOrderByLastActiveDesc("TRAINEE", pageable);

        // For each user, fetch their progress and map to DTO
        return recentTraineeUsers.stream().map(user -> {
            TraineeDashboardDTO dto = new TraineeDashboardDTO();
            dto.setId(user.getId());
            dto.setName(user.getFirstName() + " " + user.getLastName()); // Assuming name is combination of first and
                                                                         // last name
            dto.setEmail(user.getEmail());
            dto.setAvatar(user.getAvatar());
            dto.setLastActive(user.getLastActive());

            // Fetch user progress to get completion details
            List<UserProgress> userProgressList = userProgressRepository.findByUserId(user.getId());
            if (!userProgressList.isEmpty()) {
                // Assuming overall progress for the dashboard is an average or sum,
                // or you might need a specific 'overall' UserProgress entry.
                // For now, let's sum up completion percentages and average,
                // and count completed modules based on UserProgress status.

                double totalProgressPercentage = userProgressList.stream()
                        .mapToDouble(UserProgress::getCompletionPercentage)
                        .sum();
                dto.setProgress(
                        userProgressList.isEmpty() ? 0 : (int) (totalProgressPercentage / userProgressList.size()));

                long completedModules = userProgressList.stream()
                        .filter(up -> "COMPLETED".equals(up.getStatus()))
                        .count();
                dto.setCompletedModules((int) completedModules);

                // This requires knowing the total number of assigned modules for the user,
                // which isn't directly available from UserProgress alone.
                // For now, let's use the total number of modules in the system as a
                // placeholder.
                long totalModulesInSystem = moduleRepository.count();
                dto.setTotalModules((int) totalModulesInSystem);

            } else {
                // No progress found
                dto.setProgress(0);
                dto.setCompletedModules(0);
                long totalModulesInSystem = moduleRepository.count();
                dto.setTotalModules((int) totalModulesInSystem);
            }

            return dto;
        }).collect(Collectors.toList());
    }
}