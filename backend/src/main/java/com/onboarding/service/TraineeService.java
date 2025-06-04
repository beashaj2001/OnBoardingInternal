package com.onboarding.service;

import com.onboarding.dto.AchievementDto;
import com.onboarding.dto.LeaderboardEntryDto;
import com.onboarding.dto.ModuleDTO;
import com.onboarding.dto.TraineeStatsDto;

import java.util.List;

public interface TraineeService {
    TraineeStatsDto getTraineeStats(String userId);

    List<AchievementDto> getTraineeAchievements(String userId);

    List<LeaderboardEntryDto> getLeaderboardData();

    List<ModuleDTO> getTraineeModules(String userId);
}